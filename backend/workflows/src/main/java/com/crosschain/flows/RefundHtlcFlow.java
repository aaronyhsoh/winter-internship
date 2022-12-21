package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.HtlcContract;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.node.StatesToRecord;
import net.corda.core.node.services.Vault;
import net.corda.core.node.services.vault.QueryCriteria;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.UntrustworthyData;

import java.time.Instant;
import java.util.Arrays;
import java.util.UUID;

public class RefundHtlcFlow {
    @InitiatingFlow
    @StartableByRPC
    public static class HtlcRefundInitiator extends FlowLogic<SignedTransaction> {

        private final Party escrow;
        private final UniqueIdentifier htlcId;

        public HtlcRefundInitiator(Party escrow, UniqueIdentifier htlcId) {
            this.escrow = escrow;
            this.htlcId = htlcId;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            QueryCriteria.LinearStateQueryCriteria inputCriteria = new QueryCriteria.LinearStateQueryCriteria()
                    .withUuid(Arrays.asList(UUID.fromString(htlcId.toString())))
                    .withStatus(Vault.StateStatus.UNCONSUMED)
                    .withRelevancyStatus(Vault.RelevancyStatus.RELEVANT);

            StateAndRef<Htlc> stateAndRef = getServiceHub().getVaultService()
                    .queryBy(Htlc.class, inputCriteria)
                    .getStates()
                    .get(0);

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
                    .addInputState(stateAndRef)
                    .addCommand(new HtlcContract.Commands.Refund(), Arrays.asList(getOurIdentity().getOwningKey()));

            txBuilder.verify(getServiceHub());
            final SignedTransaction signedTx = getServiceHub().signInitialTransaction(txBuilder);
            // ===========================

            // nodes to update state
            FlowSession escrowSession = initiateFlow(htlcState.getEscrow());
            FlowSession receiverSession = initiateFlow(htlcState.getReceiver());
            escrowSession.send(signedTx);
            receiverSession.send(signedTx);
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
            System.out.println("Refund receiverSession: " + getOurIdentity().getName());
            System.out.println("GetCounterParty: " + senderSession.getCounterparty());

            UntrustworthyData<SignedTransaction> signedTxWrapper = senderSession.receive(SignedTransaction.class);
            SignedTransaction signedTx = signedTxWrapper.unwrap(data -> data);
            Htlc htlcState = (Htlc) signedTx.getTx().getOutputStates().get(0);

            if (getOurIdentity().equals(htlcState.getEscrow())) {
                subFlow(new TransferBondFlow.TransferBondInitiator(senderSession.getCounterparty(), htlcState.getBondId()));
            }
            return subFlow(new ReceiveFinalityFlow(senderSession, signedTx.getId(), StatesToRecord.ONLY_RELEVANT));
        }
    }

}
