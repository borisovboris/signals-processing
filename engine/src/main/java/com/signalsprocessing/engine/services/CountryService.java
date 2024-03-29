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
import com.signalsprocessing.engine.transfer.countries.BaseCityDTO;
import com.signalsprocessing.engine.transfer.countries.BaseLocationDTO;
import com.signalsprocessing.engine.transfer.countries.CitiesFiltersDTO;
import com.signalsprocessing.engine.transfer.countries.CityDTO;
import com.signalsprocessing.engine.transfer.countries.CountryDTO;
import com.signalsprocessing.engine.transfer.countries.EditedCityDTO;
import com.signalsprocessing.engine.transfer.countries.EditedLocationDTO;
import com.signalsprocessing.engine.transfer.countries.LocationDTO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Component
@ComponentScan
public class CountryService {
        private EntityManager entityManager;
        private static final int LIMIT = 25;

        public CountryService(EntityManager entityManager) {
                this.entityManager = entityManager;
        }

        public Country getCountryEntity(long id) {
                TypedQuery<Country> query = entityManager
                                .createQuery("SELECT c from Country c WHERE c.id = :id", Country.class)
                                .setParameter("id", id);
                Country country = query.getSingleResult();

                return country;
        }

        public City getCityEntity(long id) {
                TypedQuery<City> query = entityManager
                                .createQuery("SELECT ci from City ci WHERE ci.id = :id", City.class)
                                .setParameter("id", id);
                return query.getSingleResult();
        }

        public CityDTO getCity(long id) {
                City entity = getCityEntity(id);

                return new CityDTO(entity.id, entity.name, entity.postalCode);
        }

        public Location getLocationEntity(long id) {
                TypedQuery<Location> query = entityManager
                                .createQuery("SELECT l from Location l WHERE l.id = :id", Location.class)
                                .setParameter("id", id);
                return query.getSingleResult();
        }

        public CountryDTO getCountry(long id) {
                Country country = getCountryEntity(id);

                return new CountryDTO(country.id, country.name);
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

        public List<CityDTO> getCitiesOfCountry(CitiesFiltersDTO filters) {
                Long countryId = filters.getCountryId();
                Integer offset = FilterUtility.getOffset(filters.getOffset());

                TypedQuery<City> query = entityManager
                                .createQuery("SELECT c from City c WHERE c.country.id = :countryId ORDER BY c.name ASC",
                                                City.class)
                                .setParameter("countryId", countryId)
                                .setFirstResult(offset)
                                .setMaxResults(CountryService.LIMIT);

                List<CityDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new CityDTO(entity.id, entity.name, entity.postalCode))
                                .toList();

                return list;
        }

        public List<LocationDTO> getLocationsOfCity(long cityId) {
                TypedQuery<Location> query = entityManager
                                .createQuery("SELECT l from Location l WHERE l.city.id = :cityId", Location.class)
                                .setParameter("cityId", cityId)
                                .setMaxResults(CountryService.LIMIT);
                List<LocationDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> mapLocation(entity))
                                .toList();

                return list;
        }

        @Transactional
        public void createCountry(String name) {
                Country country = new Country();
                country.setName(name);

                entityManager.merge(country);
        }

        @Transactional
        public void editCountry(CountryDTO countryDto) {
                Country country = entityManager.getReference(Country.class, countryDto.id());
                country.setName(countryDto.name());

                entityManager.merge(country);
        }

        @Transactional
        public void deleteCountry(Long id) {
                entityManager.remove(entityManager.getReference(Country.class, id));
        }

        @Transactional
        public void createCity(BaseCityDTO newCityDto) {
                City city = new City();

                createOrEditCity(newCityDto, city);
        }

        @Transactional
        public void editCity(EditedCityDTO cityDto) {
                City city = entityManager.getReference(City.class, cityDto.getId());
                createOrEditCity(cityDto, city);
        }

        public void createOrEditCity(BaseCityDTO dto, City city) {
                Country country = getCountryEntity(dto.getCountryId());

                city.setCountry(country);
                city.setName(dto.getName());
                city.setPostalCode(dto.getPostalCode());

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
        public void createLocation(BaseLocationDTO newLocation) {
                Location location = new Location();
                createOrEditLocation(newLocation, location);
        }

        @Transactional
        public void editLocation(EditedLocationDTO editedLocation) {
                Location location = entityManager.getReference(Location.class, editedLocation.getId());
                createOrEditLocation(editedLocation, location);
        }

        private void createOrEditLocation(BaseLocationDTO dto, Location location) {
                City city = getCityEntity(dto.getCityId());

                location.setCity(city);
                location.setCode(dto.getName());
                location.setName(dto.getName());
                location.setAddress(dto.getAddress());
                location.setCoordinates(dto.getCoordinates());
                location.setIsOperational(dto.getIsOperational());

                entityManager.merge(location);
        }

        public LocationDTO mapLocation(Location entity) {
                return new LocationDTO(entity.id, entity.code, entity.name, entity.address,
                                entity.coordinates,
                                entity.description, entity.creationAt, entity.isOperational,
                                entity.compositions.size());
        }

        @Transactional
        public void deleteLocation(Long id) {
                entityManager.remove(entityManager.getReference(Location.class, id));
        }
}
