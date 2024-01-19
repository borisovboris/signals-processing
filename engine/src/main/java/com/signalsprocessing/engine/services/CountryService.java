package com.signalsprocessing.engine.services;

import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.signalsprocessing.engine.models.City;
import com.signalsprocessing.engine.models.Country;
import com.signalsprocessing.engine.models.Location;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

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
                                .createQuery("SELECT c from Country c WHERE c.id = :id", Country.class)
                                .setParameter("id", id);
                Country country = query.getSingleResult();

                return new CountryDTO(country.id, country.name);
        }

        public CityDTO getCity(long id) {
                TypedQuery<City> query = entityManager
                                .createQuery("SELECT ci from City ci WHERE ci.id = :id", City.class)
                                .setParameter("id", id);
                City city = query.getSingleResult();

                return new CityDTO(city.id, city.name, city.postalCode);
        }

        public List<CityDTO> getCitiesLikeName(String name) {
                TypedQuery<City> query = entityManager
                                .createQuery("SELECT ci from City ci WHERE ci.name like :name", City.class)
                                .setParameter("name", "" + name + "%")
                                .setMaxResults(CountryService.LIMIT);

                List<CityDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new CityDTO(entity.id, entity.name, entity.postalCode))
                                .toList();

                return list;
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

        public LocationsDTO getLocations(long cityId) {
                CityDTO city = getCity(cityId);

                TypedQuery<Location> query = entityManager
                                .createQuery("SELECT l from Location l WHERE l.city.id = :cityId", Location.class)
                                .setParameter("cityId", cityId)
                                .setMaxResults(CountryService.LIMIT);
                List<LocationDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new LocationDTO(entity.id, entity.code, entity.name, entity.address,
                                                entity.coordinates,
                                                entity.description, entity.creationAt, entity.isOperational,
                                                entity.compositions.size()))
                                .toList();

                return new LocationsDTO(city, list);
        }

        public record CountryDTO(@NotNull long id, @NotNull String name) {
        }

        public record CityDTO(@NotNull long id, @NotNull String name, @NotNull String postalCode) {
        }

        public record CitiesDTO(@NotNull CountryDTO country, @NotNull List<CityDTO> cities) {
        }

        public record LocationDTO(@NotNull long id, @NotNull String code, @NotNull String name, @NotNull String address,
                        String coordinates, String description, @NotNull Date creationAt,
                        @NotNull boolean isOperational, @NotNull int compositionsSize) {
        }

        public record LocationsDTO(@NotNull CityDTO city, @NotNull List<LocationDTO> locations) {
        }
}
