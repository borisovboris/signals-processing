package com.signalsprocessing.engine.services;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.signalsprocessing.engine.models.City;
import com.signalsprocessing.engine.models.Composition;
import com.signalsprocessing.engine.models.Country;
import com.signalsprocessing.engine.models.Location;
import com.signalsprocessing.engine.shared.NameFilterDTO;

import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
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

        public Country getCountry(long id) {
                TypedQuery<Country> query = entityManager
                                .createQuery("SELECT c from Country c WHERE c.id = :id", Country.class)
                                .setParameter("id", id);
                Country country = query.getSingleResult();

                return country;
        }

        public City getCity(long id) {
                TypedQuery<City> query = entityManager
                                .createQuery("SELECT ci from City ci WHERE ci.id = :id", City.class)
                                .setParameter("id", id);
                City city = query.getSingleResult();

                return city;
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

        public List<LocationDTO> getLocations(Optional<NameFilterDTO> filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<Location> criteriaQuery = cb.createQuery(Location.class);
                Root<Location> root = criteriaQuery.from(Location.class);
                CriteriaQuery<Location> initialQuery = criteriaQuery.select(root);

                if (filters.isPresent()) {
                        String name = filters.get().getName();

                        if (name != null) {
                                var locationName = root.get("name");
                                initialQuery.where(cb.like(locationName.as(String.class), name + "%"));
                        }
                }

                TypedQuery<Location> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CountryService.LIMIT);

                List<LocationDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new LocationDTO(entity.id, entity.code, entity.name, entity.address,
                                                entity.coordinates,
                                                entity.description, entity.creationAt, entity.isOperational,
                                                entity.compositions.size()))
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

        public boolean checkIfCountryExists(String name) {
                TypedQuery<Country> query = entityManager
                                .createQuery("SELECT c from Country c WHERE lower(c.name) LIKE lower(:name)",
                                                Country.class)
                                .setParameter("name", name);

                return !query.getResultList().isEmpty();
        }

        public boolean checkIfCityExists(Long countryId, String name) {
                TypedQuery<Country> query = entityManager
                                .createQuery("SELECT ci from City ci WHERE lower(ci.name) LIKE lower(:name) " +
                                                "AND ci.country.id = :countryId",
                                                Country.class)
                                .setParameter("name", name)
                                .setParameter("countryId", countryId);

                return !query.getResultList().isEmpty();
        }

        public boolean checkIfPostalCodeExists(Long countryId, String postalCode) {
                TypedQuery<Country> query = entityManager
                                .createQuery("SELECT ci from City ci WHERE ci.postalCode = :postalCode " +
                                                "AND ci.country.id = :countryId",
                                                Country.class)
                                .setParameter("postalCode", postalCode)
                                .setParameter("countryId", countryId);

                return !query.getResultList().isEmpty();
        }

        public CitiesDTO getCitiesOfCountry(long countryId) {
                Country country = getCountry(countryId);
                CountryDTO countryDto = new CountryDTO(country.id, country.name);

                TypedQuery<City> query = entityManager
                                .createQuery("SELECT c from City c WHERE c.country.id = :countryId", City.class)
                                .setParameter("countryId", countryId)
                                .setMaxResults(CountryService.LIMIT);
                List<CityDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new CityDTO(entity.id, entity.name, entity.postalCode))
                                .toList();

                return new CitiesDTO(countryDto, list);
        }

        public LocationsDTO getLocationsOfCity(long cityId) {
                City city = getCity(cityId);
                CityDTO cityDto = new CityDTO(city.id, city.name, city.postalCode);

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

                return new LocationsDTO(cityDto, list);
        }

        @Transactional
        public void createCountry(String name) {
                Country country = new Country();
                country.setName(name);

                entityManager.merge(country);
        }

        @Transactional
        public void createCity(NewCityDTO newCity) {
                Country country = getCountry(newCity.countryId);
                City city = new City();

                city.setCountry(country);
                city.setName(newCity.name);
                city.setPostalCode(newCity.postalCode);

                entityManager.merge(city);
        }

        @Transactional
        public boolean checkIfLocationNameExists(Long cityId, String name) {
                TypedQuery<Location> query = entityManager
                                .createQuery("SELECT l from Location l WHERE l.city.id = :cityId " +
                                                "AND lower(l.name) LIKE lower(:name)",
                                                Location.class)
                                .setParameter("cityId", cityId)
                                .setParameter("name", name);

                return !query.getResultList().isEmpty();
        }

        @Transactional
        public void createLocation(NewLocationDTO newLocation) {
                Location location = new Location();
                City city = getCity(newLocation.cityId);

                location.setCity(city);
                location.setCode(newLocation.name);
                location.setName(newLocation.name);
                location.setAddress(newLocation.address);
                location.setCoordinates(newLocation.coordinates);

                entityManager.merge(location);
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

        public record NewCityDTO(@NotNull Long countryId, @NotNull String name, @NotNull String postalCode) {
        }

        public record NewLocationDTO(@NotNull Long cityId, @NotNull String name, @NotNull String address,
                        String coordinates, String description) {
        }
}
