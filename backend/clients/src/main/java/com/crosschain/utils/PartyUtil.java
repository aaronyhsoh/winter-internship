package com.crosschain.utils;

import net.corda.core.identity.Party;
import net.corda.core.messaging.CordaRPCOps;

import java.util.Set;

public class PartyUtil {

    public static Party findParty(CordaRPCOps proxy, String partyName, boolean exact) throws IllegalAccessException {
        Set<Party> resultList = proxy.partiesFromName(partyName, exact);
        if (resultList.size() != 1) {
            throw new IllegalAccessException("Unique party cannot be found");
        }
        Party result = resultList.iterator().next();
        return result;
    }
}
