package com.signalsprocessing.engine.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.signalsprocessing.engine.models.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Service
public class UserService {
    private EntityManager entityManager;

    public UserService(EntityManager entityManager, PasswordEncoder passwordEncoder) {
        this.entityManager = entityManager;
    }

    public boolean checkIfUserExists(String username) {
        TypedQuery<Number> query = entityManager
                .createQuery("SELECT COUNT(u) from User u WHERE lower(u.username) = lower(:username) ",
                        Number.class)
                .setParameter("username", username);

        return query.getSingleResult().longValue() > 0L;
    }

    public User getUser(String username) {
        TypedQuery<User> query = entityManager
                .createQuery("SELECT u from User u WHERE lower(u.username) = lower(:username) ",
                        User.class)
                .setParameter("username", username);

        return query.getSingleResult();
    }

    public void saveUser(User user) {
        entityManager.persist(user);
    }
}
