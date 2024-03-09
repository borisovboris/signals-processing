package com.signalsprocessing.engine.config;

import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpHeaders;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@ComponentScan
@Component
public class JWTAuthFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;
    private final List<AntPathRequestMatcher> excludedMatchers = 
    List.of(new AntPathRequestMatcher("/swagger-ui"),
            new AntPathRequestMatcher("/v3/api-docs"), 
            new AntPathRequestMatcher("/register-user"),
            new AntPathRequestMatcher("/login-user"));

    public JWTAuthFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        if(request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean authorizationSuccessful = false;
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null) {
            String[] authElements = header.split(" ");
            boolean tokenExists = authElements.length == 2
                    && "Bearer".equals(authElements[0]);

            if (tokenExists) {
                boolean tokenIsValid = this.tokenProvider.validateToken(authElements[1]);
                if (tokenIsValid) {
                    authorizationSuccessful = true;
                }
            }
        }

        if (!authorizationSuccessful) {
            throw new RuntimeException("Authorizing header missing");
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return excludedMatchers.stream()
                .anyMatch(matcher -> matcher.matches(request));
    }
}
