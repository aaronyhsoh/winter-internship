package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.BondContract;
import com.crosschain.states.Bond;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.node.services.Vault;
import net.corda.core.node.services.vault.Builder;
import net.corda.core.node.services.vault.CriteriaExpression;
import net.corda.core.node.services.vault.FieldInfo;
import net.corda.core.node.services.vault.QueryCriteria;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import static net.corda.core.node.services.vault.QueryCriteriaUtils.getField;

public class CreateAndIssueBond {

    @InitiatingFlow
    @StartableByRPC
    public static class CreateAndIssueBondInitiator extends FlowLogic<SignedTransaction> {
        private Party holder;
        private String bondName;
        private int faceValue;
        private int couponRate;
        private int yearsToMature;
        private int paymentInterval;

        public CreateAndIssueBondInitiator(Party holder, String bondName, int faceValue, int couponRate, int yearsToMature, int paymentInterval) {
            this.holder = holder;
            this.bondName = bondName;
            this.faceValue = faceValue;
            this.couponRate = couponRate;
            this.yearsToMature = yearsToMature;
            this.paymentInterval = paymentInterval;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            Party sender = getOurIdentity();

            final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

            UniqueIdentifier uniqueId = new UniqueIdentifier();
            Bond output = new Bond(bondName, faceValue, couponRate, yearsToMature, paymentInterval, sender, uniqueId, holder);

            TransactionBuilder txBuilder = new TransactionBuilder(notary);

            txBuilder.addOutputState(output);
            txBuilder.addCommand(new BondContract.Commands.Create(), Arrays.asList(this.holder.getOwningKey(), sender.getOwningKey()));

            txBuilder.verify(getServiceHub());
            final SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            FlowSession otherPartySession = initiateFlow(holder);

            // try with signTransactionFlow
            SignedTransaction fullySignedTx = subFlow(new CollectSignaturesFlow(partSignedTx, Arrays.asList(otherPartySession)));

            // transaction notarised and recorded
            if (sender.equals(holder)) {
                return subFlow(new FinalityFlow(fullySignedTx, Collections.emptyList()));
            } else {
                return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(otherPartySession)));
            }

        }
    }

    @InitiatedBy(CreateAndIssueBondInitiator.class)
    public static class CreateAndIssueBondResponder extends FlowLogic<Void> {
        private FlowSession counterPartySession;

        public CreateAndIssueBondResponder(FlowSession counterPartySession) {
            this.counterPartySession = counterPartySession;
        }

        @Override
        @Suspendable
        public Void call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterPartySession) {
                @Override
                @Suspendable
                protected void checkTransaction(@NotNull SignedTransaction stx) throws FlowException {

                }
            });

            // store transaction into database
            subFlow(new ReceiveFinalityFlow(counterPartySession, signedTransaction.getId()));
            return null;
        }
    }
}
