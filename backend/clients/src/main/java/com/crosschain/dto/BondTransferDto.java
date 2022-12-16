package com.crosschain.dto;

public class BondTransferDto {
    private String receiver;
    private String bondId;

    public BondTransferDto(String receiver, String bondId) {
        this.receiver = receiver;
        this.bondId = bondId;
    }

    public String getReceiver() {
        return receiver;
    }

    public String getBondId() {
        return bondId;
    }
}
