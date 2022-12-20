package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.HtlcContract;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.time.Instant;
import java.util.Arrays;

public class RefundHtlcFlow {
    @InitiatingFlow
    @StartableByRPC
    public static class HtlcRefundInitiator extends FlowLogic<SignedTransaction> {

        private final Party escrow;
        private final String htlcId;

        public HtlcRefundInitiator(Party escrow, String htlcId) {
            this.escrow = escrow;
            this.htlcId = htlcId;
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
            if (!htlcState.getSender().equals(getOurIdentity())) {
                throw new FlowException("Refund can only be invoked by the sender");
            }

            if (!htlcState.getEscrow().equals(escrow)) {
                throw new FlowException("Wrong escrow provided");
            }

            // timeout status
            int timeout = htlcState.getTimeout();
            int currentTime = (int) Instant.now().getEpochSecond();
            if (currentTime <= timeout) {
                throw new FlowException("Unable to refund, swap is still valid.");
            }
            // ===========================


            // ==== Build Transaction ====
            final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);
            Htlc updatedState = htlcState.updateStatus(Htlc.REFUNDED_STATUS);

            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(updatedState)
                    .addCommand(new HtlcContract.Commands.Refund(), Arrays.asList(getOurIdentity().getOwningKey(), escrow.getOwningKey()));

            txBuilder.verify(getServiceHub());
            final SignedTransaction partialTx = getServiceHub().signInitialTransaction(txBuilder);
            // ===========================

            // nodes to update state
            FlowSession escrowSession = initiateFlow(htlcState.getEscrow());
            SignedTransaction signedTx = subFlow(new CollectSignaturesFlow(partialTx, Arrays.asList(escrowSession)));

            FlowSession receiverSession = initiateFlow(htlcState.getReceiver());
            return subFlow(new FinalityFlow(signedTx, Arrays.asList(receiverSession, escrowSession)));
        }
    }

    @InitiatedBy(HtlcRefundInitiator.class)
    public static class HtlcRefundResponder extends FlowLogic<SignedTransaction> {

        private FlowSession senderSession;

        public HtlcRefundResponder(FlowSession senderSession) {
            this.senderSession = senderSession;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {

            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(senderSession) {
                @Suspendable
                @Override
                protected void checkTransaction(SignedTransaction stx) throws FlowException {
                }
            });

            // refund bond to original sender
            Htlc htlcState = signedTransaction.getTx().outputsOfType(Htlc.class).get(0);
            subFlow(new TransferBondFlow.TransferBondInitiator(htlcState.getSender(),  htlcState.getBondId()));

            return subFlow(new ReceiveFinalityFlow(senderSession, signedTransaction.getId()));
        }
    }

}
