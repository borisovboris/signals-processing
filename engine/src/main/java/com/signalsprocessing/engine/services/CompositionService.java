package com.signalsprocessing.engine.services;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.signalsprocessing.engine.models.Composition;
import com.signalsprocessing.engine.models.CompositionStatus;
import com.signalsprocessing.engine.models.CompositionType;
import com.signalsprocessing.engine.models.Device;
import com.signalsprocessing.engine.models.DeviceStatus;
import com.signalsprocessing.engine.models.LinkedComposition;
import com.signalsprocessing.engine.models.LinkedCompositionId;
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

@Component
@ComponentScan
public class CompositionService {
        private static final int LIMIT = 25;

        private EntityManager entityManager;

        public CompositionService(EntityManager entityManager) {
                this.entityManager = entityManager;
        }

        public List<CompositionDTO> readCompositions(CompositionFiltersDTO filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<Composition> criteriaQuery = cb.createQuery(Composition.class);
                Root<Composition> root = criteriaQuery.from(Composition.class);
                // This is the query that selects all rows from the table
                CriteriaQuery<Composition> initialQuery = criteriaQuery.select(root);

                List<Long> cities = filters.cities();
                List<Long> locations = filters.locations();
                List<Long> excludedCompositions = filters.excludedCompositions();
                String code = filters.code();

                if (cities != null) {
                        var cityId = root.get("location").get("city").get("id");
                        initialQuery.where(cityId.in(cities));
                }

                if (locations != null) {
                        var locationId = root.get("location").get("id");
                        initialQuery.where(locationId.in(locations));
                }

                if (code != null && excludedCompositions != null) {
                        var compositionCode = root.get("code");
                        var compositionId = root.get("id");
                        Predicate codeIsLike = cb.like(compositionCode.as(String.class), code + "%");
                        Predicate codeIsNotIn = compositionId.in(excludedCompositions).not();

                        initialQuery.where(cb.and(codeIsLike, codeIsNotIn));
                }

                TypedQuery<Composition> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<CompositionDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> mapComposition(entity))
                                .toList();

                return list;
        }

        public CompositionDetailsDTO getCompositionDetails(long id) {
                TypedQuery<LinkedCompositions> query = entityManager.createQuery("SELECT NEW " +
                                "LinkedCompositions(fc, sc)"
                                + " FROM LinkedComposition lc"
                                + " LEFT JOIN lc.firstComposition fc"
                                + " LEFT JOIN lc.secondComposition sc"
                                + " WHERE fc.id = :id OR sc.id = :id", LinkedCompositions.class).setParameter("id", id);

                List<LinkedCompositions> list = query.getResultList();
                List<CompositionDTO> relatedCompositions = list.stream().map(lc -> {
                        return lc.firstComposition.id != id ? lc.firstComposition : lc.secondComposition;
                }).map(rc -> mapComposition(rc)).toList();
                Composition composition = getComposition(id);
                List<DeviceDTO> devices = composition.devices.stream().map(d -> mapDevice(d)).toList();

                return new CompositionDetailsDTO(mapComposition(composition), relatedCompositions, devices);
        }

        public Composition getComposition(long id) {
                TypedQuery<Composition> query = entityManager
                                .createQuery("SELECT c from Composition c WHERE c.id = :id", Composition.class)
                                .setParameter("id", id);
                Composition composition = query.getSingleResult();

                return composition;
        }

        public List<CompositionTypeDTO> getCompositionTypes(Optional<NameFilterDTO> filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<CompositionType> criteriaQuery = cb.createQuery(CompositionType.class);
                Root<CompositionType> root = criteriaQuery.from(CompositionType.class);
                CriteriaQuery<CompositionType> initialQuery = criteriaQuery.select(root);

                if (filters.isPresent()) {
                        String name = filters.get().getName();

                        if (name != null) {
                                var compositionName = root.get("name");
                                initialQuery.where(cb.like(compositionName.as(String.class), name + "%"));
                        }
                }

                TypedQuery<CompositionType> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<CompositionTypeDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new CompositionTypeDTO(entity.id, entity.name))
                                .toList();

                return list;
        }

        public List<CompositionStatusDTO> getCompositionStatuses(Optional<NameFilterDTO> filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<CompositionStatus> criteriaQuery = cb.createQuery(CompositionStatus.class);
                Root<CompositionStatus> root = criteriaQuery.from(CompositionStatus.class);
                CriteriaQuery<CompositionStatus> initialQuery = criteriaQuery.select(root);

                if (filters.isPresent()) {
                        String name = filters.get().getName();

                        if (name != null) {
                                var compositionStatusName = root.get("name");
                                initialQuery.where(cb.like(compositionStatusName.as(String.class), name + "%"));
                        }
                }

                TypedQuery<CompositionStatus> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<CompositionStatusDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new CompositionStatusDTO(entity.id, entity.name))
                                .toList();

                return list;
        }

        public static DeviceDTO mapDevice(Device device) {
                StatusDTO status = new StatusDTO(device.status.name, device.status.isOperational,
                                device.status.isBroken, device.status.inMaintenance);

                return new DeviceDTO(device.id, device.name, status, device.creationAt);
        }

        public CompositionDTO mapComposition(Composition composition) {
                String code = composition.code;
                String locationName = composition.location.name;
                Long locationId = composition.location.id;
                int devicesSize = composition.devices.size();
                StatusDTO status = new StatusDTO(composition.status.name, composition.status.isOperational,
                                composition.status.isBroken, composition.status.inMaintenance);

                return new CompositionDTO(composition.id, locationName, locationId, code, devicesSize, status);
        }

        @Transactional
        public void linkCompositions(LinkedCompositionsDTO link) {
                Composition firstComposition = getComposition(link.firstId);
                Composition secondComposition = getComposition(link.secondId);
                LinkedCompositionId id = new LinkedCompositionId(link.firstId, link.secondId);
                LinkedComposition linkedComposition = new LinkedComposition();

                linkedComposition.setId(id);
                linkedComposition.setFirstComposition(firstComposition);
                linkedComposition.setSecondComposition(secondComposition);

                entityManager.merge(linkedComposition);
        }

        @Transactional
        public void unlinkCompositions(LinkedCompositionsDTO link) {
                TypedQuery<LinkedComposition> query = entityManager.createQuery(
                                "SELECT lc from LinkedComposition lc " +
                                                "WHERE (lc.firstComposition.id = :firstId AND lc.secondComposition.id = :secondId) "
                                                +
                                                "OR (lc.firstComposition.id = :secondId AND lc.secondComposition.id = :firstId)",
                                LinkedComposition.class)
                                .setParameter("firstId", link.firstId)
                                .setParameter("secondId", link.secondId);

                LinkedComposition linkedCompositions = query.getSingleResult();

                entityManager.remove(linkedCompositions);
        }

        @Transactional
        public void createDevice(NewDeviceDTO newDevice) {
                Composition composition = entityManager.getReference(Composition.class, newDevice.compositionId);
                DeviceStatus status = entityManager.getReference(DeviceStatus.class, newDevice.statusId);

                Device device = new Device();
                device.setCode(newDevice.deviceCode);
                device.setName(newDevice.deviceName);
                device.setStatus(status);
                device.setComposition(composition);

                entityManager.merge(device);
        }

        public List<DeviceStatusDTO> getDeviceStatuses(Optional<NameFilterDTO> filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<DeviceStatus> criteriaQuery = cb.createQuery(DeviceStatus.class);
                Root<DeviceStatus> root = criteriaQuery.from(DeviceStatus.class);
                CriteriaQuery<DeviceStatus> initialQuery = criteriaQuery.select(root);

                if (filters.isPresent()) {
                        String name = filters.get().getName();

                        if (name != null) {
                                var deviceStatusName = root.get("name");
                                initialQuery.where(cb.like(deviceStatusName.as(String.class), name + "%"));
                        }
                }

                TypedQuery<DeviceStatus> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<DeviceStatusDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new DeviceStatusDTO(entity.id, entity.name))
                                .toList();

                return list;
        }

        @Transactional
        public boolean checkIfDeviceNameExists(Long compositionId, String name) {
                TypedQuery<Device> query = entityManager
                                .createQuery("SELECT d from Device d WHERE d.composition.id = :compositionId " +
                                                "AND lower(d.name) LIKE lower(:name)",
                                                Device.class)
                                .setParameter("compositionId", compositionId)
                                .setParameter("name", name);

                return !query.getResultList().isEmpty();
        }

        @Transactional
        public boolean checkIfDeviceCodeExists(Long compositionId, String code) {
                TypedQuery<Device> query = entityManager
                                .createQuery("SELECT d from Device d WHERE d.composition.id = :compositionId " +
                                                "AND lower(d.code) LIKE lower(:code)",
                                                Device.class)
                                .setParameter("compositionId", compositionId)
                                .setParameter("code", code);

                return !query.getResultList().isEmpty();
        }

        @Transactional
        public void createComposition(NewCompositionDTO newComposition) {
                Location location = entityManager.getReference(Location.class, newComposition.locationId);
                CompositionStatus status = entityManager.getReference(CompositionStatus.class, newComposition.statusId);
                CompositionType type = entityManager.getReference(CompositionType.class, newComposition.typeId);

                Composition composition = new Composition();
                composition.setCode(newComposition.code);
                composition.setLocation(location);
                composition.setStatus(status);
                composition.setType(type);
                composition.setDescription(newComposition.description);
                composition.setCoordinates(newComposition.coordinates);

                entityManager.merge(composition);
        }

        @Transactional
        public boolean checkIfCompositionExists(Long locationId, String code) {
                TypedQuery<Composition> query = entityManager
                                .createQuery("SELECT c from Composition c WHERE c.location.id = :locationId " +
                                                "AND lower(c.code) LIKE lower(:code)",
                                                Composition.class)
                                .setParameter("locationId", locationId)
                                .setParameter("code", code);

                return !query.getResultList().isEmpty();
        }

        @Transactional
        public CompositionStatus getCompositionStatus(Long id) {
                TypedQuery<CompositionStatus> query = entityManager
                                .createQuery("SELECT cs from CompositionStatus cs WHERE cs.id = :id",
                                                CompositionStatus.class)
                                .setParameter("id", id);

                return query.getSingleResult();
        }

        @Transactional
        public CompositionType getCompositionType(Long id) {
                TypedQuery<CompositionType> query = entityManager
                                .createQuery("SELECT ct from CompositionType ct WHERE ct.id = :id",
                                                CompositionType.class)
                                .setParameter("id", id);

                return query.getSingleResult();
        }

        @Transactional
        public void deleteDevice(Long id) {
                TypedQuery<Device> query = entityManager
                                .createQuery("SELECT d from Device d WHERE d.id = :id", Device.class)
                                .setParameter("id", id);

                Device device = query.getSingleResult();

                entityManager.remove(device);
        }

        public List<DeviceDateStatusDTO> getDeviceStatusTimeline(Long id) {
                LocalDate lastThirtyDays = LocalDate.now().minusDays(30);
                Timestamp timeStamp = Timestamp.valueOf(lastThirtyDays.atStartOfDay());

                TypedQuery<DeviceDateStatusDTO> query = entityManager.createQuery(
                                "SELECT NEW DeviceDateStatusDTO(COUNT(dsr.id) as occurrences, cast(dsr.creationAt as date) as date) "
                                                +
                                                "from DeviceStatusRecord dsr WHERE dsr.device.id = :id " +
                                                "AND dsr.creationAt > :lastThirtyDays " +
                                                "AND dsr.status.isOperational != true " +
                                                "GROUP BY cast(dsr.creationAt as date)",
                                DeviceDateStatusDTO.class)
                                .setParameter("id", id)
                                .setParameter("lastThirtyDays", timeStamp);

                List<DeviceDateStatusDTO> list = query.getResultList();
                return list;
        }

        public List<DeviceDTO> getDevices(NameFilterDTOs filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<Device> criteriaQuery = cb.createQuery(Device.class);
                Root<Device> root = criteriaQuery.from(Device.class);
                CriteriaQuery<Device> initialQuery = criteriaQuery.select(root);

                Optional<String> name = filters.name;

                if (name.isPresent()) {
                        var deviceName = root.get("name");
                        initialQuery.where(cb.like(deviceName.as(String.class), name.get() + "%"));
                }

                TypedQuery<Device> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<DeviceDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> mapDevice(entity))
                                .toList();

                return list;
        }

        public record CompositionDTO(@NotNull long id, @NotNull String locationName, @NotNull Long locationId, @NotNull String code,
                        @NotNull int devicesSize,
                        @NotNull StatusDTO status) {
        }

        public record StatusDTO(@NotNull String name, @NotNull boolean isOperational, @NotNull boolean isBroken,
                        @NotNull boolean inMaintenance) {
        }

        public record LinkedCompositions(Composition firstComposition, Composition secondComposition) {
        }

        public record CompositionDetailsDTO(@NotNull CompositionDTO composition,
                        @NotNull List<CompositionDTO> relatedCompositions,
                        @NotNull List<DeviceDTO> devices) {
        }

        public record CompositionFiltersDTO(@Nullable List<Long> cities, @Nullable List<Long> locations,
                        @Nullable List<Long> excludedCompositions, @Nullable String code) {
        }

        public record DeviceDTO(@NotNull long id, @NotNull String name,
                        @NotNull StatusDTO status, @NotNull Date creationAt) {
        }

        public record LinkedCompositionsDTO(@NotNull long firstId, @NotNull long secondId) {
        }

        public record NewDeviceDTO(@NotNull long compositionId, @NotNull String deviceCode, @NotNull String deviceName,
                        @NotNull long statusId) {
        }

        public record DeviceDateStatusDTO(@NotNull Long occurrences, @NotNull Date date) {
        }

        public record CompositionTypeDTO(@NotNull Long id, @NotNull String name) {
        }

        public record CompositionStatusDTO(@NotNull Long id, @NotNull String name) {
        }

        public record DeviceStatusDTO(@NotNull Long id, @NotNull String name) {
        }

        public record NewCompositionDTO(@NotNull String code, @NotNull Long locationId, @NotNull Long typeId,
                        @NotNull Long statusId,
                        @Nullable String coordinates, @Nullable String description) {
        }

        public record NameFilterDTOs(Optional<String> name) {
        }
}
