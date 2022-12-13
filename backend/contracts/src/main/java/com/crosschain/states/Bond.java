package com.crosschain.states;

import com.crosschain.contracts.BondContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.ContractState;
import net.corda.core.contracts.LinearState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@BelongsToContract(BondContract.class)
public class Bond implements LinearState {

    private String bondName;
    private int faceValue; // money amount the bond will be worth
    private int couponRate; // rate of interest
    private int yearsToMature;
    private int paymentInterval; // in years

    private Date issueDate;
    private Date maturityDate;
    private String bondRating;

    private Party issuer;
    private Party holder;

    // LinearState required variable
    private UniqueIdentifier linearID;

    //required by all corda states to indicate storing parties
    private List<AbstractParty> participants;

    @ConstructorForDeserialization
    public Bond(String bondName, int faceValue, int couponRate, int yearsToMature, int paymentInterval, Date issueDate, Date maturityDate, String bondRating, Party issuer, Party holder, UniqueIdentifier linearID) {
        this.bondName = bondName;
        this.faceValue = faceValue;
        this.couponRate = couponRate;
        this.yearsToMature = yearsToMature;
        this.paymentInterval = paymentInterval;
        this.issueDate = issueDate;
        this.maturityDate = maturityDate;
        this.bondRating = bondRating;
        this.issuer = issuer;
        this.holder = holder;
        this.linearID = linearID;
        this.participants = new ArrayList<AbstractParty>();
        this.participants.add(issuer);
        this.participants.add(holder);
    }

    public Bond(String bondName, int faceValue, int couponRate, int yearsToMature, int paymentInterval, Party issuer, UniqueIdentifier linearID, Party holder) {
        this.bondName = bondName;
        this.faceValue = faceValue;
        this.couponRate = couponRate;
        this.yearsToMature = yearsToMature;
        this.paymentInterval = paymentInterval;
        this.issuer = issuer;
        this.linearID = linearID;
        this.holder = holder;
        this.participants = new ArrayList<AbstractParty>();
        this.participants.add(issuer);
        this.participants.add(holder);
    }

    public String getBondName() {
        return bondName;
    }

    public UniqueIdentifier getLinearID() {
        return linearID;
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

    public Date getIssueDate() {
        return issueDate;
    }

    public Date getMaturityDate() {
        return maturityDate;
    }

    public String getBondRating() {
        return bondRating;
    }

    public Party getIssuer() {
        return issuer;
    }

    public Party getHolder() {
        return holder;
    }

    @Override
    @NotNull
    public List<AbstractParty> getParticipants() {
        return participants;
    }

    @NotNull
    @Override
    public UniqueIdentifier getLinearId() {
        return linearID;
    }

    public Bond changeOwner(Party buyer) {
        Bond newOwnerState = new Bond(this.bondName, this.faceValue, this.couponRate, this.yearsToMature, this.paymentInterval, this.issueDate, this.maturityDate, this.bondRating, this.issuer, buyer, this.linearID);
        return newOwnerState;
    }
}
