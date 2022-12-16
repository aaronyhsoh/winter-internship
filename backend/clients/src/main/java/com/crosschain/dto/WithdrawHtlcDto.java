package com.crosschain.dto;

public class WithdrawHtlcDto {

    private final String escrow;
    private final String htlcId;
    private final String secret;

    public WithdrawHtlcDto(String escrow, String htlcId, String secret) {
        this.escrow = escrow;
        this.htlcId = htlcId;
        this.secret = secret;
    }

    public String getEscrow() {
        return escrow;
    }

    public String getHtlcId() {
        return htlcId;
    }

    public String getSecret() {
        return secret;
    }
}
