package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.BondContract;
import com.crosschain.states.Bond;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;

import java.util.Collections;

public class CreateBond {

    @InitiatingFlow
    @StartableByRPC
    public static class CreateBondInitiator extends FlowLogic<SignedTransaction> {
        private String bondName;
        private int faceValue;
        private int couponRate;
        private int yearsToMature;
        private int paymentInterval;

        public CreateBondInitiator(String bondName, int faceValue, int couponRate, int yearsToMature, int paymentInterval) {
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

            // build output bond
            UniqueIdentifier uniqueId = new UniqueIdentifier();
            Bond output = new Bond(bondName, faceValue, couponRate, yearsToMature, paymentInterval, sender, uniqueId);

            TransactionBuilder txBuilder = new TransactionBuilder(notary);

            txBuilder.addOutputState(output);
            txBuilder.addCommand(new BondContract.Commands.Create(), sender.getOwningKey());

            txBuilder.verify(getServiceHub());

            SignedTransaction signedTransaction = getServiceHub().signInitialTransaction(txBuilder);

            return subFlow(new FinalityFlow(signedTransaction, Collections.emptyList()));
        }
    }
}
