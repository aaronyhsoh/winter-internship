package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.BondContract;
import com.crosschain.states.Bond;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.node.services.Vault;
import net.corda.core.node.services.vault.QueryCriteria;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.UUID;

import static net.corda.core.contracts.ContractsDSL.requireThat;

public class TransferBondFlow {

    @InitiatingFlow
    @StartableByRPC
    public static class TransferBondInitiator extends FlowLogic<SignedTransaction> {
        private Party holder;
        private UniqueIdentifier bondId;

        public TransferBondInitiator(Party buyer, UniqueIdentifier bondId) {
            this.holder = buyer;
            this.bondId = bondId;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {

            QueryCriteria.LinearStateQueryCriteria inputCriteria = new QueryCriteria.LinearStateQueryCriteria()
                    .withUuid(Arrays.asList(UUID.fromString(bondId.toString())))
                    .withStatus(Vault.StateStatus.UNCONSUMED)
                    .withRelevancyStatus(Vault.RelevancyStatus.RELEVANT);

            StateAndRef bondStateAndRef = getServiceHub().getVaultService().queryBy(Bond.class, inputCriteria).getStates().get(0);
            Bond originalBond = (Bond) bondStateAndRef.getState().getData();

            // ensure that initiator is the owner of the bond
            requireThat(require -> {
                require.using("Owner of the bond is not the initiator.", originalBond.getHolder().equals(getOurIdentity()));
                return null;
            });

            // output bond with new owner
            Bond output = originalBond.changeOwner(holder);

            Party notary = bondStateAndRef.getState().getNotary();
            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addInputState(bondStateAndRef)
                    .addOutputState(output, BondContract.ID)
                    .addCommand(new BondContract.Commands.Transfer(), Arrays.asList(this.holder.getOwningKey(), getOurIdentity().getOwningKey()));

            txBuilder.verify(getServiceHub());

            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            // initiate sessions for all parties
            FlowSession otherPartySession = initiateFlow(holder);
            FlowSession bondIssuerSession = initiateFlow(output.getIssuer());

            final SignedTransaction fullySignedTx = subFlow(new CollectSignaturesFlow(partSignedTx, Arrays.asList(otherPartySession)));

            // tell everyone to save the transaction
            if (holder.equals(output.getIssuer()) || output.getIssuer().equals(getOurIdentity())) {
                return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession)));
            } else {
                return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession, bondIssuerSession)));
            }

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
