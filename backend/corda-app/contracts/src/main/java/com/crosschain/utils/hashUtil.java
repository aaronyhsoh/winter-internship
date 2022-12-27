package com.crosschain.utils;

import org.bouncycastle.jcajce.provider.digest.Keccak;
import org.bouncycastle.util.encoders.Hex;

import java.nio.charset.StandardCharsets;

public class hashUtil {

    public static String generateHash(String secret) {
        Keccak.Digest256 digest256 = new Keccak.Digest256();
        byte[] hashbytes = digest256.digest(secret.getBytes(StandardCharsets.UTF_8));
        return new String(Hex.encode(hashbytes));
    }
}
