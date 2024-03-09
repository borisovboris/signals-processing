package com.signalsprocessing.engine.config;

import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.signalsprocessing.engine.services.UserService;
import com.signalsprocessing.engine.services.AuthService.UserDTO;

import jakarta.annotation.PostConstruct;

@ComponentScan
@Component
@ConfigurationPropertiesScan 
public class TokenProvider {
    @Value("${jwt.secretKey}")
    private String secretKey;

    private final static int ONE_HOUR = 3600000;

    private final UserService userService;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public TokenProvider(UserService userService) {
        this.userService = userService;
    }

    public String createToken(UserDTO user) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + ONE_HOUR);

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(user.username())
                .withIssuedAt(now)
                .withExpiresAt(expiresAt)
                .withClaim("username", user.username())
                .sign(algorithm);
    }

    public boolean validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        return this.userService.checkIfUserExists(decoded.getSubject());
    }
}
