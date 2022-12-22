package com.crosschain.utils;

import org.bouncycastle.jcajce.provider.digest.SHA256;
import org.bouncycastle.util.encoders.Hex;

import java.nio.charset.StandardCharsets;

public class hashUtil {

    public static String generateHash(String secret) {
        SHA256.Digest shaDigest = new SHA256.Digest();
        byte[] hashBytes = shaDigest.digest(secret.getBytes(StandardCharsets.UTF_8));
        return new String(Hex.encode(hashBytes));
    }
}
