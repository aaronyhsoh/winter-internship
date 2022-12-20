package com.crosschain.dto;

public class RefundHtlcDto {
    private String escrow;
    private String htlcId;

    public RefundHtlcDto(String escrow, String htlcId) {
        this.escrow = escrow;
        this.htlcId = htlcId;
    }

    public String getEscrow() {
        return escrow;
    }

    public String getHtlcId() {
        return htlcId;
    }
}
