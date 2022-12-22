package com.crosschain.utils;

import org.bouncycastle.jcajce.provider.digest.SHA256;
import org.bouncycastle.util.encoders.Hex;

import java.nio.charset.StandardCharsets;

public class hashUtil {

    public static String generateHash(String secret) {
//        Keccak.Digest256 digest256 = new Keccak.Digest256();
//        byte[] hashBytes = digest256.digest(secret.getBytes(StandardCharsets.UTF_8));

        SHA256.Digest shaDigest = new SHA256.Digest();
        byte[] hashBytes = shaDigest.digest(secret.getBytes(StandardCharsets.UTF_8));

        System.out.println( "0x" + new String(Hex.encode(hashBytes)));
        return new String(Hex.encode(hashBytes));
    }
}
