package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.states.Bond;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.FlowException;
import net.corda.core.flows.FlowLogic;
import net.corda.core.flows.InitiatingFlow;
import net.corda.core.flows.StartableByRPC;

public class CheckBond  {

    @InitiatingFlow
    @StartableByRPC
    public static class CheckBondById extends FlowLogic<Bond> {
        private String bondId;

        public CheckBondById(String bondId) {
            this.bondId = bondId;
        }

        @Override
        @Suspendable
        public Bond call() throws FlowException {
            StateAndRef<Bond> bondStateAndRef = getServiceHub().getVaultService()
                    .queryBy(Bond.class)
                    .getStates()
                    .stream()
                    .filter(data -> data.getState().getData().getLinearId().equals(bondId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Bond state with the id " + bondId + "does not exist"));
            Bond bondState = bondStateAndRef.getState().getData();
            return bondState;
        }
    }

}
