package com.crosschain.contracts;

import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

public class HtlcContract implements Contract {
    public static String ID = "com.crosschain.contracts.HtlcContract";

    public interface Commands extends CommandData {
        class Initiated implements BondContract.Commands {}
        class Withdraw implements BondContract.Commands {}
        class Refund implements BondContract.Commands {}
    }

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {

    }
}
