package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.HtlcContract;
import com.crosschain.states.Htlc;
import net.corda.core.flows.FlowException;
import net.corda.core.flows.FlowLogic;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;

import java.time.Instant;

public class HtlcFlow extends FlowLogic<SignedTransaction> {
    private String htlcId;
    private Party receiver;
    private Party escrow;
    private int timeout;
    private String currency;
    private int amount;
    private String hash;

    public HtlcFlow(String htlcId, Party receiver, Party escrow, int timeout, String currency, int amount, String hash) {
        this.htlcId = htlcId;
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
        Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

        // create transaction components
        Htlc output = new Htlc(htlcId, getOurIdentity(), receiver, escrow, timeout ,hash, amount, currency);
        HtlcContract.Commands.Initiated command = new HtlcContract.Commands.Initiated();

        // transfer bond to escrow
//        subFlow()

        // transaction builder

        // verify transaction is valid

        // create sessions to escrow and receiver

        // sign transaction

        // escrow sign transaction

        return null;
    }
}
