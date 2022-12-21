package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.flows.FlowException;
import net.corda.core.flows.FlowLogic;
import net.corda.core.flows.InitiatingFlow;
import net.corda.core.flows.StartableByRPC;

public class CheckHtlc {

    @InitiatingFlow
    @StartableByRPC
    public static class CheckHtlcById extends FlowLogic<Htlc> {
        private String htlcId;

        public CheckHtlcById(String htlcId) {
            this.htlcId = htlcId;
        }

        @Override
        @Suspendable
        public Htlc call() throws FlowException {
            StateAndRef<Htlc> htlcStateAndRef = getServiceHub().getVaultService()
                    .queryBy(Htlc.class)
                    .getStates()
                    .stream().filter(data1 ->
                            data1.getState().getData().getHtlcId().getId().toString().equals(htlcId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Htlc with the id " + htlcId + "does not exist"));
            Htlc htlcState = htlcStateAndRef.getState().getData();
            return htlcState;
        }
    }
}
