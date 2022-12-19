package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.BondContract;
import com.crosschain.contracts.HtlcContract;
import com.crosschain.states.Bond;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.UntrustworthyData;
import org.hibernate.Transaction;
import org.intellij.lang.annotations.Flow;
import org.jetbrains.annotations.NotNull;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;

import static com.crosschain.utils.hashUtil.generateHash;

public class HtlcFlow {

    @InitiatingFlow
    @StartableByRPC
    public static class HtlcInitiator extends FlowLogic<SignedTransaction> {
        private String htlcId;
        private UniqueIdentifier bondId;
        private Party receiver;
        private Party escrow;
        private int timeout;
        private String currency;
        private int amount;
        private String hash;

        public HtlcInitiator(String htlcId, UniqueIdentifier bondId, Party receiver, Party escrow, int timeout, String currency, int amount, String hash) {
            this.htlcId = htlcId;
            this.bondId = bondId;
            this.receiver = receiver;
            this.escrow = escrow;
            this.timeout = (int) (Instant.now().getEpochSecond() + timeout);
            this.currency = currency;
            this.amount = amount;
            this.hash = hash;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            final Party notary = getServiceHub().getNetworkMapCache().getNotary(CordaX500Name.parse("O=Notary,L=London,C=GB"));

            // create transaction components
            Htlc output = new Htlc(htlcId, bondId, getOurIdentity(), receiver, escrow, timeout, hash, amount, currency, Htlc.INITIATED_STATUS);

            // get bond
            StateAndRef<Bond> bondStateAndRef = getServiceHub().getVaultService()
                    .queryBy(Bond.class)
                    .getStates()
                    .stream().filter(data1 ->
                            data1.getState().getData().getLinearId().equals(bondId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Bond state with the id " + bondId + "does not exist"));
            Bond bondState = bondStateAndRef.getState().getData();

            // verify initiator is bond owner
            if (!bondState.getHolder().equals(getOurIdentity())){
                throw new FlowException(getOurIdentity().getName() + " is not the owner of " + bondState.getHolder().getName() + "'s bond");
            }

            // transfer bond to escrow
            subFlow(new TransferBondFlow.TransferBondInitiator(escrow, bondId));

            // transaction builder
            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(output, HtlcContract.ID)
                    .addCommand(new HtlcContract.Commands.Initiated(),
                            Arrays.asList(getOurIdentity().getOwningKey(), receiver.getOwningKey(), escrow.getOwningKey()));

            System.out.println("Htlc flow" + Arrays.asList(getOurIdentity().getName(), escrow.getName(), receiver.getName()));

            // verify transaction is valid
            txBuilder.verify(getServiceHub());

            // sign transaction
            SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder, getOurIdentity().getOwningKey());

            // create sessions to escrow and receiver
            FlowSession escrowSession = initiateFlow(output.getEscrow());
            FlowSession receiverSession = initiateFlow(output.getReceiver());

            // escrow and receiver sign transaction
            final SignedTransaction fullySignedTx = subFlow(new CollectSignaturesFlow(partSignedTx, Arrays.asList(escrowSession, receiverSession)));

            return subFlow(new FinalityFlow(fullySignedTx, Arrays.asList(escrowSession, receiverSession)));
        }
    }

    @InitiatedBy(HtlcFlow.HtlcInitiator.class)
    public static class HtlcResponder extends FlowLogic<SignedTransaction> {

        private final FlowSession counterPartySession;

        public HtlcResponder(FlowSession counterPartySession) {
            this.counterPartySession = counterPartySession;
        }


        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            SignedTransaction signedTransaction = subFlow(new SignTransactionFlow(counterPartySession) {
                @Override
                protected void checkTransaction(@NotNull SignedTransaction stx) throws FlowException {
                }
            });
            return subFlow(new ReceiveFinalityFlow(counterPartySession, signedTransaction.getId()));
        }
    }

    @InitiatingFlow
    @StartableByRPC
    public static class HtlcWithdrawInitiator extends FlowLogic<Htlc> {

        private final Party escrow;
        private final String htlcId;
        private final String secret;

        public HtlcWithdrawInitiator(Party escrow, String htlcId, String secret) {
            this.escrow = escrow;
            this.htlcId = htlcId;
            this.secret = secret;
        }

        @Override
        @Suspendable
        public Htlc call() throws FlowException {
            FlowSession escrowSession = initiateFlow(escrow);
            LinkedHashMap<String, String> payload = new LinkedHashMap<>();
            payload.put("htlcId", htlcId);
            payload.put("secret", secret);
            UntrustworthyData<Htlc> result = escrowSession.sendAndReceive(Htlc.class, payload);
            Htlc output = result.unwrap(data -> data);
            return output;
        }
    }

    @InitiatedBy(HtlcWithdrawInitiator.class)
    public static class HtlcWithdrawResponder extends FlowLogic<SignedTransaction> {
        private final FlowSession receiverSession;

        public HtlcWithdrawResponder(FlowSession receiverSession) {
            this.receiverSession = receiverSession;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            UntrustworthyData<LinkedHashMap> payload = receiverSession.receive(LinkedHashMap.class);
            LinkedHashMap<String, String> data = payload.unwrap(data1 -> data1);
            String htlcId = data.get("htlcId");
            String secret = data.get("secret");

            // find htlc class
            StateAndRef<Htlc> stateAndRef = getServiceHub().getVaultService()
                    .queryBy(Htlc.class)
                    .getStates()
                    .stream().filter(data1 ->
                            data1.getState().getData().getHtlcId().equals(htlcId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Htlc state with id " + htlcId + "does not exist"));

            Htlc htlcState = stateAndRef.getState().getData();

            // verify receiver's identity
            Party receiveHtlc = htlcState.getReceiver();
            if (!receiverSession.getCounterparty().equals(receiveHtlc)) {
                receiverSession.send("Unable to withdraw, withdrawal can only be invoked by the intended receiver");
                throw new FlowException("Unable to withdraw, withdrawal can only be invoked by the intended receiver");
            }
            int timeout = htlcState.getTimeout();
            int currentTime = (int) Instant.now().getEpochSecond();

            // if current time passed the deadline
            if (currentTime > timeout) {
                receiverSession.send("Timeout error");
                throw new FlowException("Timeout error");
            }

            // verify secret
            String hash = htlcState.getHash();
            String generatedHash = generateHash(secret);

            if (hash.equals(generatedHash)) {
                final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

                Htlc updatedState = htlcState.updateStatus(Htlc.WITHDRAW_STATUS);

                TransactionBuilder txBuilder = new TransactionBuilder(notary);

                txBuilder.addOutputState(updatedState);
                txBuilder.addCommand(new HtlcContract.Commands.Withdraw(), Arrays.asList(getOurIdentity().getOwningKey()));

                txBuilder.verify(getServiceHub());

                receiverSession.send(updatedState);
                final SignedTransaction signedTx = getServiceHub().signInitialTransaction(txBuilder);

                FlowSession senderSession = initiateFlow(htlcState.getSender());
                FlowSession escrowSession = initiateFlow(htlcState.getEscrow());

                //transfer bond
                subFlow(new TransferBondFlow.TransferBondInitiator(receiverSession.getCounterparty(), htlcState.getBondId()));

                // escrow and receiver update state
                return subFlow(new FinalityFlow(signedTx, Arrays.asList(receiverSession, senderSession, escrowSession)));
            } else {
                throw new FlowException("Incorrect secret");
            }
        }
    }

    @InitiatingFlow
    @StartableByRPC
    public static class HtlcRefundInitiator extends FlowLogic<Htlc> {

        private final Party escrow;
        private final String htlcId;

        public HtlcRefundInitiator(Party escrow, String htlcId) {
            this.escrow = escrow;
            this.htlcId = htlcId;
        }

        @Override
        @Suspendable
        public Htlc call() throws FlowException {
            FlowSession escrowSession = initiateFlow(escrow);
            UntrustworthyData<Htlc> resultWrapper = escrowSession.sendAndReceive(Htlc.class, htlcId);
            Htlc result = resultWrapper.unwrap(data -> data);
            return result;
        }
    }

    @InitiatedBy(HtlcRefundInitiator.class)
    public static class HtlcRefundResponder extends FlowLogic<SignedTransaction> {

        private FlowSession senderSession;

        public HtlcRefundResponder(FlowSession senderSession) {
            this.senderSession = senderSession;
        }

        @Override
        @Suspendable
        public SignedTransaction call() throws FlowException {
            UntrustworthyData<String> htlcIdWrapper = senderSession.receive(String.class);
            String htlcId = htlcIdWrapper.unwrap(data -> data);

            StateAndRef<Htlc> stateAndRef = getServiceHub().getVaultService()
                    .queryBy(Htlc.class)
                    .getStates()
                    .stream()
                    .filter(data -> data.getState().getData().getHtlcId().equals(htlcId))
                    .findAny()
                    .orElseThrow(() -> new IllegalArgumentException("Htlc state with id " + htlcId + "does not exist"));

            Htlc htlcState = stateAndRef.getState().getData();

            //verify initiator identity
            if (!htlcState.getSender().equals(senderSession.getCounterparty())) {
                throw new FlowException("Refund can only be invoked by the sender");
            }
            int timeout = htlcState.getTimeout();
            int currentTime = (int) Instant.now().getEpochSecond();

            // verify timeout
            if (currentTime <= timeout) {
                senderSession.send("Unable to refund, swap is still valid.");
                throw new FlowException("Unable to refund, swap is still valid.");
            }

            // ==== Build Transaction ====
            final Party notary = getServiceHub().getNetworkMapCache().getNotaryIdentities().get(0);

            Htlc updatedState = htlcState.updateStatus(Htlc.REFUNDED_STATUS);

            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(updatedState)
                    .addCommand(new HtlcContract.Commands.Refund(), Arrays.asList(getOurIdentity().getOwningKey()));

            txBuilder.verify(getServiceHub());

            final SignedTransaction signedTx = getServiceHub().signInitialTransaction(txBuilder);

            // transfer bond
            subFlow(new TransferBondFlow.TransferBondInitiator(htlcState.getSender(),  htlcState.getBondId()));

            // send updated state to htlc sender
            senderSession.send(updatedState);

            // nodes to update state
            FlowSession escrowSession = initiateFlow(htlcState.getEscrow());
            FlowSession receiverSession = initiateFlow(htlcState.getReceiver());
            return subFlow(new FinalityFlow(signedTx, Arrays.asList(senderSession, receiverSession, escrowSession)));

        }
    }

}
