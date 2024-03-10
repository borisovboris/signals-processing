package com.signalsprocessing.engine.services;

import java.nio.CharBuffer;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.signalsprocessing.engine.auth.TokenProviderService;
import com.signalsprocessing.engine.models.User;
import com.signalsprocessing.engine.transfer.user.UserDTO;

import jakarta.transaction.Transactional;

@ComponentScan
@Component
public class AuthService {
    private PasswordEncoder encoder;
    private UserService userService;
    private final TokenProviderService tokenProvider;

    public AuthService(PasswordEncoder passwordEncoder, UserService userService, TokenProviderService tokenProvider) {
        this.encoder = passwordEncoder;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public void registerUser(UserDTO user) {
            User newUser = new User();

            String encryptedPass = encoder.encode(CharBuffer.wrap(user.password()));

            newUser.setUsername(user.username());
            newUser.setPassword(encryptedPass);

           this.userService.saveUser(newUser);
    }

    public String loginUser(UserDTO userDto) {
        User user = this.userService.getUser(userDto.username());

        boolean passwordMatch = encoder.matches(CharBuffer.wrap(userDto.password()), user.password);

        if(!passwordMatch) {
            throw new RuntimeException("Wrong username or password");
        }

        return tokenProvider.createToken(userDto);
    }
}
