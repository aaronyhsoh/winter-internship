package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.states.Bond;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.FlowException;
import net.corda.core.flows.FlowLogic;
import net.corda.core.flows.InitiatingFlow;
import net.corda.core.flows.StartableByRPC;

import java.util.List;

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
                    .filter(data -> data.getState().getData().getLinearId().getId().toString().equals(bondId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Bond state with the id " + bondId + "cannot be found"));
            Bond bondState = bondStateAndRef.getState().getData();
            return bondState;
        }
    }


    @InitiatingFlow
    @StartableByRPC
    public static class CheckHoldingBonds extends FlowLogic<Bond> {

        public CheckHoldingBonds(String bondId) {
        }

        @Override
        @Suspendable
        public List<Bond> call() throws FlowException {
            StateAndRef<Bond> bondStateAndRef = getServiceHub().getVaultService()
                    .queryBy(Bond.class)
                    .getStates()
                    .stream()
                    .filter(data -> data.getState().getData().getLinearId().getId().toString().equals(bondId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Bond state with the id " + bondId + "cannot be found"));
            Bond bondState = bondStateAndRef.getState().getData();
            return bondState;
        }
    }
}
