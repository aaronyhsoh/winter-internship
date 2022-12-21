package com.crosschain.webserver;

import com.crosschain.dto.*;
import com.crosschain.flows.*;
import com.crosschain.states.Bond;
import com.crosschain.states.Htlc;
import net.corda.core.contracts.UniqueIdentifier;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.identity.Party;
import net.corda.core.messaging.CordaRPCOps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.crosschain.utils.PartyUtil.findParty;

/**
 * Define your API endpoints here.
 */
@RestController
@RequestMapping("/") // The paths for HTTP requests are relative to this base path.
public class Controller {
    private final CordaRPCOps proxy;
    private final CordaX500Name me;
    private final static Logger logger = LoggerFactory.getLogger(Controller.class);

    public Controller(NodeRPCConnection rpc) {
        this.proxy = rpc.proxy;
        this.me = proxy.nodeInfo().getLegalIdentities().get(0).getName();
    }

    // returns generated bond id
    @RequestMapping(value = "/bond/create", method = RequestMethod.POST)
    private ResponseEntity<Object> createAndIssueBond(@RequestBody CreateBondDto newBond) {
        try {
            //run flow to create bond
            Party holder = findParty(proxy, newBond.getHolder(), false);

            Bond output = (Bond) proxy.startTrackedFlowDynamic(
                    CreateAndIssueBond.CreateAndIssueBondInitiator.class,
                    holder,
                    newBond.getBondName(),
                    newBond.getFaceValue(),
                    newBond.getCouponRate(),
                    newBond.getYearsToMature(),
                    newBond.getPaymentInterval()
                    )
                    .getReturnValue()
                    .get()
                    .getTx()
                    .outputsOfType(Bond.class)
                    .get(0);

            return ResponseEntity.ok(output.getLinearID().getId().toString());
        } catch (Exception ex) {
            System.out.println("Exception: " + ex.getStackTrace());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @RequestMapping(value="/bond/transfer", method=RequestMethod.POST)
    public ResponseEntity<Object> transferBond(@RequestBody BondTransferDto request) {
        try {
            Party receiver =  findParty(proxy,request.getReceiver(), false);
            UniqueIdentifier bondId = new UniqueIdentifier(null, UUID.fromString(request.getBondId()));

            Bond output = (Bond) proxy.startTrackedFlowDynamic(
                    TransferBondFlow.TransferBondInitiator.class,
                    receiver,
                    bondId)
                    .getReturnValue()
                    .get()
                    .getTx()
                    .outputsOfType(Bond.class)
                    .get(0);

            return ResponseEntity.ok(output.getHolder().getName());
        } catch (Exception ex) {
            System.out.println("Exception: " + ex.getStackTrace());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @RequestMapping(value="/bond", method=RequestMethod.GET)
    public ResponseEntity<Object> getBondById(@RequestParam String id) {
       try {
            Bond output = (Bond) proxy.startTrackedFlowDynamic(CheckBond.CheckBondById.class, id)
                    .getReturnValue()
                    .get();

            return ResponseEntity.ok(output);
       } catch (Exception ex) {
           System.out.println("Exception: " + ex.getMessage());
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
       }
    }

    @RequestMapping(value="/bond/holder", method=RequestMethod.GET)
    public ResponseEntity<Object> getHoldingBonds() {
        try {
            List<Bond> output = (List<Bond>) proxy.startTrackedFlowDynamic(CreateAndIssueBond.CheckHoldingBonds.class)
                    .getReturnValue()
                    .get();

            return ResponseEntity.ok(output);
        } catch (Exception ex) {
            System.out.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @RequestMapping(value = "/htlc/bond/initiate", method=RequestMethod.POST)
    public ResponseEntity<Object> createBondHtlc(@RequestBody CreateHtlcDto newHtlc) {

        try {
            // get party from name
            Party receiver = findParty(proxy, newHtlc.getReceiver(), false);
            Party escrow = findParty(proxy, newHtlc.getEscrow(), false);

            UniqueIdentifier bondId = new UniqueIdentifier(null, UUID.fromString(newHtlc.getBondId()));
            UniqueIdentifier htlcId = new UniqueIdentifier(null, UUID.fromString(newHtlc.getHtlcId()));

            // start flow
            Htlc output = proxy.startTrackedFlowDynamic(
                    HtlcFlow.HtlcInitiator.class,
                    htlcId,
                    bondId,
                    receiver,
                    escrow,
                    newHtlc.getTimeout(),
                    newHtlc.getCurrency(),
                    newHtlc.getAmount(),
                    newHtlc.getHash()
                ).getReturnValue().get().getTx().outputsOfType(Htlc.class).get(0);

            return ResponseEntity.ok(output);
        } catch (Exception ex) {
            System.out.println("Exception: " + ex.getStackTrace());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @RequestMapping(value = "/htlc/bond/withdraw", method=RequestMethod.POST)
    public ResponseEntity<Object> withdrawBondHtlc(@RequestBody WithdrawHtlcDto withdrawHtlc) {
        try {
            Party escrow = findParty(proxy, withdrawHtlc.getEscrow(), false);
            UniqueIdentifier htlcId = new UniqueIdentifier(null, UUID.fromString(withdrawHtlc.getHtlcId()));

            Htlc output = (Htlc) proxy.startTrackedFlowDynamic(
                    WithdrawHtlcFlow.HtlcWithdrawInitiator.class,
                    escrow,
                    htlcId,
                    withdrawHtlc.getSecret())
                    .getReturnValue()
                    .get()
                    .getTx()
                    .outputsOfType(Htlc.class)
                    .get(0);


            return ResponseEntity.ok(output);
        } catch (Exception ex) {
            System.out.println("Exception: " + ex.getStackTrace());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @RequestMapping(value="/htlc/bond/refund", method = RequestMethod.POST)
    public ResponseEntity<Object> refundBondHtlc(@RequestBody RefundHtlcDto request) {
        try {
            Party escrow = findParty(proxy, request.getEscrow(), false);
            UniqueIdentifier htlcId = new UniqueIdentifier(null, UUID.fromString(request.getHtlcId()));

            Htlc output = proxy.startTrackedFlowDynamic(
                    RefundHtlcFlow.HtlcRefundInitiator.class,
                    escrow,
                    htlcId)
                    .getReturnValue()
                    .get()
                    .getTx()
                    .outputsOfType(Htlc.class)
                    .get(0);

            return ResponseEntity.ok(output);
        } catch (Exception ex) {
            System.out.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @RequestMapping(value="/htlc", method=RequestMethod.GET)
    public ResponseEntity<Object> getHtlcById(@RequestParam String id) {
        try {
            Htlc output = (Htlc) proxy.startTrackedFlowDynamic(CheckHtlc.CheckHtlcById.class, id)
                    .getReturnValue()
                    .get();

            return ResponseEntity.ok(output);
        } catch (Exception ex) {
            System.out.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}