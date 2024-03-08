package com.signalsprocessing.engine.services;

import java.nio.CharBuffer;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.signalsprocessing.engine.models.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;

@ComponentScan
@Component
public class AuthService {
    private EntityManager entityManager;
    private PasswordEncoder encoder;

    public AuthService(EntityManager entityManager, PasswordEncoder passwordEncoder) {
        this.entityManager = entityManager;
        this.encoder = passwordEncoder;
    }

    public boolean checkIfUserExists(String username) {
        TypedQuery<User> query = entityManager
                .createQuery("SELECT u from User u WHERE lower(u.name) = lower(:username) ",
                        User.class)
                .setParameter("username", username);

        return !query.getResultList().isEmpty();
    }

    @Transactional
    public void registerUser(UserDTO user) {
            User newUser = new User();

            String encryptedPass = encoder.encode(CharBuffer.wrap(user.password));

            newUser.setUsername(user.username);
            newUser.setPassword(encryptedPass);

            entityManager.persist(newUser);
    }

    public void login(UserDTO user) {

    }

    public record UserDTO(@NotNull String username, @NotNull String password) {}
}
