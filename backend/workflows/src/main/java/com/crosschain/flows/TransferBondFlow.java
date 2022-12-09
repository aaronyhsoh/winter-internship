package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.BondContract;
import com.crosschain.states.Bond;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.node.services.Vault;
import net.corda.core.node.services.vault.QueryCriteria;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import org.jetbrains.annotations.NotNull;
import sun.security.x509.UniqueIdentity;

import java.util.Arrays;
import java.util.UUID;

public class TransferBondFlow {

    @InitiatingFlow
    @StartableByRPC
    public static class TransferBondInitiator extends FlowLogic<SignedTransaction> {
        private Party buyer;
        private UniqueIdentity bondId;

        public TransferBondInitiator(Party buyer, UniqueIdentity bondId) {
            this.buyer = buyer;
            this.bondId = bondId;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            QueryCriteria.LinearStateQueryCriteria inputCriteria = new QueryCriteria.LinearStateQueryCriteria()
                    .withUuid(Arrays.asList(UUID.fromString(bondId.toString())))
                    .withStatus(Vault.StateStatus.UNCONSUMED)
                    .withRelevancyStatus(Vault.RelevancyStatus.RELEVANT);

            // reference data without consuming it
            StateAndRef bondStateAndRef = getServiceHub().getVaultService().queryBy(Bond.class, inputCriteria).getStates().get(0);

            // ensure that initiator is the owner of the bond
            Bond originalBond = (Bond) bondStateAndRef.getState().getData();

            Bond output = originalBond.changeOwner(buyer);

            Party notary = bondStateAndRef.getState().getNotary();

            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addInputState(bondStateAndRef)
                    .addOutputState(output, BondContract.ID)
                    .addCommand(new BondContract.Commands.Transfer(), Arrays.asList(getOurIdentity().getOwningKey(), this.buyer.getOwningKey()));

            txBuilder.verify(getServiceHub());

            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            FlowSession otherPartySession = initiateFlow(buyer);
            final SignedTransaction fullySignedTx = subFlow(
                    new CollectSignaturesFlow(partSignedTx, Arrays.asList(otherPartySession))
            );

            SignedTransaction result = subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession)));

            return result;
        }
    }

    @InitiatedBy(TransferBondInitiator.class)
    public static class TransferBondResponder extends FlowLogic<Void> {

        private FlowSession counterPartySession;

        public TransferBondResponder(FlowSession counterPartySession) {
            this.counterPartySession = counterPartySession;
        }

        @Override
        @Suspendable
        public Void call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterPartySession) {
                @Override
                protected void checkTransaction(@NotNull SignedTransaction stx) throws FlowException {
                }
            });

            subFlow(new ReceiveFinalityFlow(counterPartySession, signedTransaction.getId()));
            return null;
        }
    }
}
