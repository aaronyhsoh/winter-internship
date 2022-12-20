package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.HtlcContract;
import com.crosschain.states.Bond;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.UntrustworthyData;

import javax.annotation.Signed;
import java.time.Instant;
import java.util.Arrays;

import static com.crosschain.utils.hashUtil.generateHash;

public class WithdrawHtlcFlow {

    @InitiatingFlow
    @StartableByRPC
    public static class HtlcWithdrawInitiator extends FlowLogic<SignedTransaction> {

        private final Party escrow;
        private final String htlcId;
        private final String secret;

        public HtlcWithdrawInitiator(Party escrow, String htlcId, String secret) {
            this.escrow = escrow;
            this.htlcId = htlcId;
            this.secret = secret;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            StateAndRef<Htlc> stateAndRef = getServiceHub().getVaultService()
                    .queryBy(Htlc.class)
                    .getStates()
                    .stream()
                    .filter(data -> data.getState().getData().getHtlcId().equals(htlcId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Htlc state with id " + htlcId + "does not exist"));
            Htlc htlcState = stateAndRef.getState().getData();

            // ==== Verify Transaction ====
            if (!htlcState.getReceiver().equals(getOurIdentity())) {
                throw new FlowException("Unable to withdraw, withdrawal can only be invoked by the intended receiver");
            }
            int timeout = htlcState.getTimeout();
            int currentTime = (int) Instant.now().getEpochSecond();

            // if current time passed the deadline
            if (currentTime > timeout) {
                throw new FlowException("Timeout error");
            }

            // verify secret
            String hash = htlcState.getHash();
            String generatedHash = generateHash(secret);
            // =============================

            if (hash.equals(generatedHash)) {
                // Build Transaction
                final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);
                Htlc updatedState = htlcState.updateStatus(Htlc.WITHDRAW_STATUS);

                FlowSession escrowSession = initiateFlow(htlcState.getEscrow());
                FlowSession senderSession = initiateFlow(htlcState.getSender());

                TransactionBuilder txBuilder = new TransactionBuilder(notary)
                        .addOutputState(updatedState)
                        .addCommand(new HtlcContract.Commands.Withdraw(), Arrays.asList(getOurIdentity().getOwningKey()));
                txBuilder.verify(getServiceHub());

                final SignedTransaction signedTx = getServiceHub().signInitialTransaction(txBuilder);
                escrowSession.send(signedTx);
                senderSession.send(signedTx);
                return subFlow(new FinalityFlow(signedTx, Arrays.asList(senderSession, escrowSession)));
            } else {
                throw new FlowException("Incorrect secret");
            }
        }
    }

    @InitiatedBy(HtlcWithdrawInitiator.class)
    public static class HtlcWithdrawResponder extends FlowLogic<SignedTransaction> {
        private final FlowSession receiverSession;

        public HtlcWithdrawResponder(FlowSession receiverSession) {
            this.receiverSession = receiverSession;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            System.out.println("receiverSession: " + getOurIdentity().getName());
            UntrustworthyData<SignedTransaction> signedTxWrapper = receiverSession.receive(SignedTransaction.class);
            SignedTransaction signedTx = signedTxWrapper.unwrap(data -> data);
            Htlc htlcState = (Htlc) signedTx.getTx().getOutputStates().get(0);

            if (receiverSession.getCounterparty().equals(htlcState.getEscrow())) {
                subFlow(new TransferBondFlow.TransferBondInitiator(receiverSession.getCounterparty(), htlcState.getBondId()));
            }

            return subFlow(new ReceiveFinalityFlow(receiverSession, signedTx.getId()));
        }
    }

}
