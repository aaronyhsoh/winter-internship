package com.crosschain.flows;

import co.paralleluniverse.fibers.Suspendable;
import com.crosschain.contracts.HtlcContract;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.StateAndRef;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.flows.*;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.transactions.SignedTransaction;
import net.corda.core.transactions.TransactionBuilder;
import net.corda.core.utilities.UntrustworthyData;
import org.jetbrains.annotations.NotNull;

import java.time.Instant;
import java.util.Arrays;
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
            Htlc output = new Htlc(htlcId, bondId, getOurIdentity(), receiver, escrow, timeout, hash, amount, currency);
            HtlcContract.Commands.Initiated command = new HtlcContract.Commands.Initiated();

            // transfer bond to escrow
            subFlow(new TransferBondFlow.TransferBondInitiator(escrow, bondId));

            // transaction builder
            TransactionBuilder txBuilder = new TransactionBuilder(notary)
                    .addOutputState(output, HtlcContract.ID)
                    .addCommand(new HtlcContract.Commands.Initiated(), Arrays.asList(getOurIdentity().getOwningKey(), escrow.getOwningKey(), receiver.getOwningKey()));

            // verify transaction is valid
            txBuilder.verify(getServiceHub());

            // create sessions to escrow and receiver
            FlowSession escrowSession = initiateFlow(escrow);
            FlowSession receiverSession = initiateFlow(receiver);

            // sign transaction
            SignedTransaction partSignedTx = getServiceHub().signInitialTransaction(txBuilder);

            // escrow sign transaction
            SignedTransaction fullySignedTx = subFlow(new CollectSignaturesFlow(partSignedTx, Arrays.asList(escrowSession, receiverSession)));

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

    // withdraw flow will be initiated by receiver
    @InitiatingFlow
    @StartableByRPC
    public static class HtlcWithdrawInitiator extends FlowLogic<String> {

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
        public String call() throws FlowException {
            FlowSession escrowSession = initiateFlow(escrow);
            LinkedHashMap<String, String> payload = new LinkedHashMap<>();
            payload.put("htlcId", htlcId);
            payload.put("secret", secret);
            UntrustworthyData<String> result = escrowSession.sendAndReceive(String.class, payload);
            String output = result.unwrap(data -> {
                return data;
            });
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
            LinkedHashMap<String, String> data = payload.unwrap(data1 -> {
                return data1;
            });
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


            // check timeout
            int timeout = htlcState.getTimeout();
            System.out.println("Timeout time: " + timeout);
            int currentTime = (int) Instant.now().getEpochSecond();

            if (currentTime > timeout) {
                receiverSession.send("Timeout error");
                throw new FlowException("Timeout error");
            }

            // verify secret
            String hash = htlcState.getHash();
            String generatedHash = generateHash(secret);

            if (hash.equals(generatedHash)) {
                receiverSession.send("Withdraw Successful");
                return subFlow(new TransferBondFlow.TransferBondInitiator(receiverSession.getCounterparty(), htlcState.getBondId()));
            } else {
                throw new FlowException("Secret provided is incorrect");
            }
        }
    }
}
