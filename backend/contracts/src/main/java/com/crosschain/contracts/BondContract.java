package com.crosschain.contracts;

import com.crosschain.states.Bond;
import net.corda.core.contracts.CommandData;
import net.corda.core.contracts.Contract;
import net.corda.core.transactions.LedgerTransaction;
import org.jetbrains.annotations.NotNull;

import static net.corda.core.contracts.ContractsDSL.requireThat;

public class BondContract implements Contract {

    public static final String ID = "com.crosschain.contracts.BondContract";

    public interface Commands extends CommandData {
        class Create implements BondContract.Commands {}
        class Issue implements BondContract.Commands {}
        class Transfer implements BondContract.Commands {}
        class Redeem implements BondContract.Commands {}
    }

    @Override
    public void verify(@NotNull LedgerTransaction tx) throws IllegalArgumentException {
        final CommandData commandData = tx.getCommands().get(0).getValue();

        // creation of bond
        if (commandData instanceof BondContract.Commands.Create) {
            //Retrieve the output state of the transaction
            Bond output = tx.outputsOfType(Bond.class).get(0);

            requireThat(require -> {
                require.using("This transaction should only output one Bond state", tx.getOutputs().size() == 1);
                require.using("The bond's face value should be larger than 0.", output.getFaceValue() > 0);
                require.using("The bond's coupon rate should be larger than 0.", output.getCouponRate() > 0);
                return null;
            });
        } else if (commandData instanceof BondContract.Commands.Issue) {
            // TO BE FILLED
        } else if (commandData instanceof BondContract.Commands.Transfer) {

        } else if (commandData instanceof BondContract.Commands.Redeem) {
            // TO BE FILLED
        } else {
            throw new IllegalArgumentException("Incorrect type of Bond Commands");
        }
    }
}
