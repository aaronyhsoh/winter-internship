package com.crosschain.dto;

import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.Party;

import java.util.UUID;

public class CreateHtlcDto {

    private String htlcId;
    private String bondId;
    private String receiver;
    private String escrow;
    private int timeout;
    private String currency;
    private int amount;
    private String hash;

    public CreateHtlcDto(String bondId, String receiver, String escrow, int timeout, String currency, int amount, String hash) {
        this.htlcId = UUID.randomUUID().toString();
        this.bondId = bondId;
        this.receiver = receiver;
        this.escrow = escrow;
        this.timeout = timeout;
        this.currency = currency;
        this.amount = amount;
        this.hash = hash;
    }

    public String getHtlcId() {
        return htlcId;
    }

    public String getBondId() {
        return bondId;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getEscrow() {
        return escrow;
    }

    public int getTimeout() {
        return timeout;
    }

    public String getCurrency() {
        return currency;
    }

    public int getAmount() {
        return amount;
    }

    public String getHash() {
        return hash;
    }
}
