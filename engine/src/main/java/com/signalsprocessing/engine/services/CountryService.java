package com.signalsprocessing.engine.services;

import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.signalsprocessing.engine.models.City;
import com.signalsprocessing.engine.models.Country;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.validation.constraints.NotNull;

@Component
@ComponentScan
public class CountryService {
    private EntityManager entityManager;
    private static final int LIMIT = 25;

    public CountryService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public CountryDTO getCountry(long id) {
        TypedQuery<Country> query = entityManager
                .createQuery("SELECT c from Country c WHERE c.id = :id", Country.class).setParameter("id", id);
        Country country = query.getSingleResult();

        return new CountryDTO(country.id, country.name);
    }

    public List<CountryDTO> getCountries() {
        TypedQuery<Country> query = entityManager
                .createQuery("SELECT c from Country c", Country.class)
                .setMaxResults(CountryService.LIMIT);
        List<CountryDTO> list = query
                .getResultList()
                .stream()
                .map(entity -> new CountryDTO(entity.id, entity.name))
                .toList();

        return list;
    }

    public List<CountryDTO> getCountriesWithOffset(long minId) {
        TypedQuery<Country> query = entityManager
                .createQuery("SELECT c from Country c WHERE c.id > :minId", Country.class)
                .setParameter("minId", minId)
                .setMaxResults(CountryService.LIMIT);
        List<CountryDTO> list = query
                .getResultList()
                .stream()
                .map(entity -> new CountryDTO(entity.id, entity.name))
                .toList();

        return list;
    }

    public CitiesDTO getCitiesOfCountry(long countryId) {
        CountryDTO country = getCountry(countryId);

        TypedQuery<City> query = entityManager
                .createQuery("SELECT c from City c WHERE c.country.id = :countryId", City.class)
                .setParameter("countryId", countryId)
                .setMaxResults(CountryService.LIMIT);
        List<CityDTO> list = query
                .getResultList()
                .stream()
                .map(entity -> new CityDTO(entity.id, entity.name, entity.postalCode))
                .toList();

        return new CitiesDTO(country, list);
    }

    public record CountryDTO(@NotNull long id, @NotNull String name) {
    }

    public record CityDTO(@NotNull long id, @NotNull String name, @NotNull String postalCode) {
    }

    public record CitiesDTO(@NotNull CountryDTO country, @NotNull List<CityDTO> cities) {
    }
}
