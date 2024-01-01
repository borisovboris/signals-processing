package com.example.signalsprocessing.signals;

import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.example.signalsprocessing.models.Signal;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Component
@ComponentScan
public class SignalsService {
    private EntityManager entityManager;

    public SignalsService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public String readSignals() {
        TypedQuery<Signal> query = entityManager.createQuery("SELECT s from Signal s", Signal.class);
        List<Signal> list = query.getResultList();

        return "These are the signals";
    }
}
