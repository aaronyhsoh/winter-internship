package com.crosschain.states;

import com.crosschain.contracts.HtlcContract;
import net.corda.core.contracts.BelongsToContract;
import net.corda.core.contracts.ContractState;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.AbstractParty;
import net.corda.core.identity.Party;
import net.corda.core.serialization.ConstructorForDeserialization;
import org.jetbrains.annotations.NotNull;

import java.util.Arrays;
import java.util.List;

@BelongsToContract(HtlcContract.class)
public class Htlc implements ContractState {

    private String htlcId;
    private UniqueIdentifier bondId;
    private Party sender;
    private Party receiver;
    private Party escrow;
    private int timeout; // in seconds
    private String key; // client generate off chain
    private String hash;
    //    private HtlcStatusEnum status;

    public Htlc(String htlcId, UniqueIdentifier bondId, Party sender, Party receiver, Party escrow, int timeout, String hash, int amount, String currency) {
        this.htlcId = htlcId;
        this.bondId = bondId;
        this.sender = sender;
        this.receiver = receiver;
        this.escrow = escrow;
        this.timeout = timeout;
        this.hash = hash;
        //        this.status = HtlcStatusEnum.SENDER_INITIATED;
    }

    @ConstructorForDeserialization
    public Htlc(String htlcId, UniqueIdentifier bondId, Party sender, Party receiver, Party escrow, int timeout, String key, String hash) {
        this.htlcId = htlcId;
        this.bondId = bondId;
        this.sender = sender;
        this.receiver = receiver;
        this.escrow = escrow;
        this.timeout = timeout;
        this.key = key;
        this.hash = hash;
    }

    @NotNull
    @Override
    public List<AbstractParty> getParticipants() {
        return Arrays.asList(sender, receiver, escrow);
    }

    public String getHtlcId() {
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

    public String getKey() {
        return key;
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

    //    public HtlcStatusEnum getStatus() {
//        return status;
//    }
}
