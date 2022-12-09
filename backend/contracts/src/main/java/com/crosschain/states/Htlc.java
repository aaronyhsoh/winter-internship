package com.crosschain.states;

import net.corda.core.contracts.ContractState;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.List;

public class Htlc implements ContractState {

    private String HtlcId;
    private Party sender;
    private Party receiver;
    private Party escrow;
    private int timeout; // in seconds
    private String key; // client generate off chain
    private String hash;
    private int amount; // amount of tokens to transfer
    private String currency; // token currency
//    private HtlcStatusEnum status;

    public Htlc(String htlcId, Party sender, Party receiver, Party escrow, int timeout, String hash, int amount, String currency) {
        HtlcId = htlcId;
        this.sender = sender;
        this.receiver = receiver;
        this.escrow = escrow;
        this.timeout = timeout;
        this.hash = hash;
        this.amount = amount;
        this.currency = currency;
//        this.status = HtlcStatusEnum.SENDER_INITIATED;
    }

    @ConstructorForDeserialization
    public Htlc(String htlcId, Party sender, Party receiver, Party escrow, int timeout, String key, String hash, int amount, String currency) {
        HtlcId = htlcId;
        this.sender = sender;
        this.receiver = receiver;
        this.escrow = escrow;
        this.timeout = timeout;
        this.key = key;
        this.hash = hash;
        this.amount = amount;
        this.currency = currency;
    }

    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        return Arrays.asList(sender, receiver, escrow);
    }

    public String getHtlcId() {
        return HtlcId;
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

    public String getKey() {
        return key;
    }

    public String getHash() {
        return hash;
    }

    public int getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

//    public HtlcStatusEnum getStatus() {
//        return status;
//    }
}
