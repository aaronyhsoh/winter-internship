package com.crosschain.webserver;

import com.crosschain.flows.CreateAndIssueBond;
import com.crosschain.states.Bond;
import net.corda.core.identity.CordaX500Name;
import net.corda.core.messaging.CordaRPCOps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(value = "/templateendpoint", produces = "text/plain")
    private String templateEndPoint() {
        return "Define an endpoint here.";
    }

    // returns generated bond id
    @RequestMapping(value = "/bond/create", method = RequestMethod.POST)
    private ResponseEntity<String> createAndIssueBond(@RequestBody Bond newBond) {
        System.out.println(newBond);
        try {
            //run flow to create bond
            Bond output = (Bond) proxy.startTrackedFlowDynamic(
                    CreateAndIssueBond.CreateAndIssueBondInitiator.class,
                    newBond.getHolder(),
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
            System.out.println("Exception: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

}