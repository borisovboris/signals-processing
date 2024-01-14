package com.signalsprocessing.engine.services;

import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.signalsprocessing.engine.models.Country;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Component
@ComponentScan
public class CountryService {
    private EntityManager entityManager;

    public CountryService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<CountryDTO> getCountries() {
        TypedQuery<Country> query = entityManager.createQuery("SELECT c from Country c", Country.class);
        List<CountryDTO> list = query
                .getResultList()
                .stream()
                .map(entity -> new CountryDTO(entity.name))
                .toList();

        return list;
    }

    public record CountryDTO(String name) {
    }
}
