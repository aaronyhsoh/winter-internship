package com.crosschain.dto;

public class CreateBondDto {
    private String holder;
    private String bondName;
    private int faceValue;
    private int couponRate;
    private int yearsToMature;
    private int paymentInterval;

    public CreateBondDto(String holder, String bondName, int faceValue, int couponRate, int yearsToMature, int paymentInterval) {
        this.holder = holder;
        this.bondName = bondName;
        this.faceValue = faceValue;
        this.couponRate = couponRate;
        this.yearsToMature = yearsToMature;
        this.paymentInterval = paymentInterval;
    }

    public String getHolder() {
        return holder;
    }

    public String getBondName() {
        return bondName;
    }

    public int getFaceValue() {
        return faceValue;
    }

    public int getCouponRate() {
        return couponRate;
    }

    public int getYearsToMature() {
        return yearsToMature;
    }

    public int getPaymentInterval() {
        return paymentInterval;
    }
}
