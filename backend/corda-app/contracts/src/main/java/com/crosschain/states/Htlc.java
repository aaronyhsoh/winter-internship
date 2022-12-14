package com.crosschain.states;

import com.crosschain.contracts.HtlcContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.LinearState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.List;

@BelongsToContract(HtlcContract.class)
public class Htlc implements LinearState {

    private UniqueIdentifier htlcId;
    private UniqueIdentifier bondId;
    private Party sender;
    private Party receiver;
    private Party escrow;
    private int timeout;
    private String hash;
    private int amount;
    private String currency;
    private String status;

    public static final String INITIATED_STATUS = "INITIATED";
    public static final String WITHDRAW_STATUS = "WITHDRAW";
    public static final String REFUNDED_STATUS = "REFUNDED";

    @ConstructorForDeserialization
    public Htlc(UniqueIdentifier htlcId, UniqueIdentifier bondId, Party sender, Party receiver, Party escrow, int timeout, String hash, int amount, String currency, String status) {
        this.htlcId = htlcId;
        this.bondId = bondId;
        this.sender = sender;
        this.receiver = receiver;
        this.escrow = escrow;
        this.timeout = timeout;
        this.hash = hash;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
    }

    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        return Arrays.asList(sender, receiver, escrow);
    }

    public UniqueIdentifier getHtlcId() {
        return htlcId;
    }

    public Party getSender() {
        return sender;
    }

    public Party getReceiver() {
        return receiver;
    }

    public int getTimeout() {
        return timeout;
    }

    public String getHash() {
        return hash;
    }

    public Party getEscrow() {
        return escrow;
    }

    public UniqueIdentifier getBondId() {
        return bondId;
    }

    public int getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public String getStatus() {
        return status;
    }

    public Htlc updateStatus(String newStatus) {
        Htlc output = new Htlc(htlcId,  bondId,  sender,  receiver,  escrow,  timeout,  hash,  amount,  currency, newStatus);
        return output;
    }

    @NotNull
    @Override
    public UniqueIdentifier getLinearId() {
        return this.htlcId;
    }
}
