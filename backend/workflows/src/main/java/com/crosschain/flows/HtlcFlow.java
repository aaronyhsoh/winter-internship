package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.HtlcContract;
import com.crosschain.states.Bond;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import org.jetbrains.annotations.NotNull;

import java.time.Instant;
import java.util.Arrays;

public class HtlcFlow {

    @InitiatingFlow
    @StartableByRPC
    public static class HtlcInitiator extends FlowLogic<SignedTransaction> {
        private String htlcId;
        private UniqueIdentifier bondId;
        private Party receiver;
        private Party escrow;
        private int timeout;
        private String currency;
        private int amount;
        private String hash;

        public HtlcInitiator(String htlcId, UniqueIdentifier bondId, Party receiver, Party escrow, int timeout, String currency, int amount, String hash) {
            this.htlcId = htlcId;
            this.bondId = bondId;
            this.receiver = receiver;
            this.escrow = escrow;
            this.timeout = (int) (Instant.now().getEpochSecond() + timeout);
            this.currency = currency;
            this.amount = amount;
            this.hash = hash;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB"));

            // create transaction components
            Htlc output = new Htlc(htlcId, bondId, getOurIdentity(), receiver, escrow, timeout, hash, amount, currency, Htlc.INITIATED_STATUS);

            StateAndRef<Bond> bondStateAndRef = getServiceHub().getVaultService()
                    .queryBy(Bond.class)
                    .getStates()
                    .stream().filter(data ->
                            data.getState().getData().getLinearId().equals(bondId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Bond state with the id " + bondId + "does not exist"));
            Bond bondState = bondStateAndRef.getState().getData();

            // verify initiator is bond owner
            if (!bondState.getHolder().equals(getOurIdentity())){
                throw new FlowException(getOurIdentity().getName() + " is not the owner of " + bondState.getHolder().getName() + "'s bond");
            }

            // transfer bond to escrow
            subFlow(new TransferBondFlow.TransferBondInitiator(escrow, bondId));

            // transaction builder
            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(output, HtlcContract.ID)
                    .addCommand(new HtlcContract.Commands.Initiated(),
                            Arrays.asList(getOurIdentity().getOwningKey(), receiver.getOwningKey(), escrow.getOwningKey()));
            txBuilder.verify(getServiceHub());

            // sign transaction
            SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder, getOurIdentity().getOwningKey());

            // create sessions to escrow and receiver
            FlowSession escrowSession = initiateFlow(output.getEscrow());
            FlowSession receiverSession = initiateFlow(output.getReceiver());

            // escrow and receiver sign transaction
            final SignedTransaction fullySignedTx = subFlow(new CollectSignaturesFlow(partSignedTx, Arrays.asList(escrowSession, receiverSession)));

            return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(escrowSession, receiverSession)));
        }
    }

    @InitiatedBy(HtlcFlow.HtlcInitiator.class)
    public static class HtlcResponder extends FlowLogic<SignedTransaction> {

        private final FlowSession counterPartySession;

        public HtlcResponder(FlowSession counterPartySession) {
            this.counterPartySession = counterPartySession;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            System.out.println("counterPartySession" + counterPartySession.getCounterparty().getName());
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterPartySession) {
                @Override
                protected void checkTransaction(@NotNull SignedTransaction stx) throws FlowException {
                }
            });
            return subFlow(new ReceiveFinalityFlow(counterPartySession, signedTransaction.getId()));
        }
    }

}
