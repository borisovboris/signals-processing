package com.signalsprocessing.engine.services;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.signalsprocessing.engine.models.City;
import com.signalsprocessing.engine.models.Country;
import com.signalsprocessing.engine.models.Location;
import com.signalsprocessing.engine.shared.FilterUtility;
import com.signalsprocessing.engine.shared.NameFilterDTO;
import com.signalsprocessing.engine.shared.OffsetConstraint;

import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

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

        public List<CityDTO> getCitiesLikeName(NameFilterDTO filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<City> criteriaQuery = cb.createQuery(City.class);
                Root<City> root = criteriaQuery.from(City.class);
                CriteriaQuery<City> initialQuery = criteriaQuery.select(root);

                Predicate[] filterPredicates = FilterUtility.getFilterPredicates(filters, cb, root);
                Predicate finalCriteria = cb.and(filterPredicates);
                initialQuery.where(finalCriteria);

                TypedQuery<City> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CountryService.LIMIT);

                List<CityDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new CityDTO(entity.id, entity.name, entity.postalCode))
                                .toList();

                return list;
        }

        public List<LocationDTO> getLocations(NameFilterDTO filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<Location> criteriaQuery = cb.createQuery(Location.class);
                Root<Location> root = criteriaQuery.from(Location.class);
                CriteriaQuery<Location> initialQuery = criteriaQuery.select(root);

                Predicate[] filterPredicates = FilterUtility.getFilterPredicates(filters, cb, root);
                Predicate finalCriteria = cb.and(filterPredicates);
                initialQuery.where(finalCriteria);

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

        public List<CountryDTO> getCountries(Optional<Integer> offset) {
                int defaultOffset = 1;

                if (offset.isPresent()) {
                        defaultOffset = offset.get();
                }

                TypedQuery<Country> query = entityManager
                                .createQuery("SELECT c from Country c ORDER BY c.name ASC", Country.class)
                                .setFirstResult(defaultOffset)
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

        public CitiesDTO getCitiesOfCountry(CitiesFiltersDTO filters) {
                Long countryId = filters.getCountryId();
                Country country = getCountry(countryId);
                CountryDTO countryDto = new CountryDTO(country.id, country.name);
                Integer offset = FilterUtility.getOffset(filters.getOffset());

                TypedQuery<City> query = entityManager
                                .createQuery("SELECT c from City c WHERE c.country.id = :countryId", City.class)
                                .setParameter("countryId", countryId)
                                .setFirstResult(offset)
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
        public void deleteCountry(Long id) {
                entityManager.remove(entityManager.getReference(Country.class, id));
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
        public void deleteCity(Long id) {
                entityManager.remove(entityManager.getReference(City.class, id));
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

        @Transactional
        public void deleteLocation(Long id) {
                entityManager.remove(entityManager.getReference(Location.class, id));
        }

        public record CountryDTO(@NotNull long id, @NotNull String name) {
        }

        public record CityDTO(@NotNull long id, @NotNull String name, @NotNull String postalCode) {
        }

        public record CitiesDTO(@NotNull CountryDTO country, @NotNull List<CityDTO> cities) {
        }

        public record LocationDTO(@NotNull long id, @NotNull String code, @NotNull String name, @NotNull String address,
                        String coordinates, String description, @NotNull LocalDate creationAt,
                        @NotNull boolean isOperational, @NotNull int compositionsSize) {
        }

        public record LocationsDTO(@NotNull CityDTO city, @NotNull List<LocationDTO> locations) {
        }

        public record NewCityDTO(@NotNull Long countryId, @NotNull String name, @NotNull String postalCode) {
        }

        public record NewLocationDTO(@NotNull Long cityId, @NotNull String name, @NotNull String address,
                        String coordinates, String description) {
        }

        public class CitiesFiltersDTO extends OffsetConstraint {
                private Long countryId;

                public CitiesFiltersDTO(Long countryId, @Nullable Integer offset) {
                        super(offset);
                        this.countryId = countryId;
                }

                public Long getCountryId() {
                        return countryId;
                }
        }
}
