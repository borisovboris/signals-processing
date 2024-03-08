package com.signalsprocessing.engine.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JWTConfigProperties {
    private final String secretKey = "strawberryMilk";

    public String getSecretKey() {
        return secretKey;
    }
}
