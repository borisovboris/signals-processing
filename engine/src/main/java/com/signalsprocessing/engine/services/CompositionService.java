package com.signalsprocessing.engine.services;

import com.signalsprocessing.engine.shared.FilterUtility;
import com.signalsprocessing.engine.shared.LabeledValueDTO;
import com.signalsprocessing.engine.shared.NameFilterDTO;
import com.signalsprocessing.engine.transfer.compositions.BaseCompositionDTO;
import com.signalsprocessing.engine.transfer.compositions.BaseDeviceDTO;
import com.signalsprocessing.engine.transfer.compositions.CompositionDTO;
import com.signalsprocessing.engine.transfer.compositions.CompositionDetailsDTO;
import com.signalsprocessing.engine.transfer.compositions.CompositionFiltersDTO;
import com.signalsprocessing.engine.transfer.compositions.DeviceDTO;
import com.signalsprocessing.engine.transfer.compositions.DeviceDateStatusDTO;
import com.signalsprocessing.engine.transfer.compositions.DeviceDetailsDTO;
import com.signalsprocessing.engine.transfer.compositions.EditedCompositionDTO;
import com.signalsprocessing.engine.transfer.compositions.EditedDeviceDTO;
import com.signalsprocessing.engine.transfer.compositions.LinkedCompositions;
import com.signalsprocessing.engine.transfer.compositions.LinkedCompositionsDTO;
import com.signalsprocessing.engine.transfer.compositions.StatusDTO;

import java.time.LocalDate;
import java.util.ArrayList;
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

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

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

                List<Predicate> predicates = new ArrayList<>();

                Optional<List<Long>> cities = filters.getCities();
                Optional<List<Long>> locations = filters.getLocations();
                Optional<List<Long>> excludedCompositions = filters.getExcludedCompositions();
                Optional<String> code = filters.getCode();

                if (cities.isPresent()) {
                        var cityId = root.get("location").get("city").get("id");
                        predicates.add(cityId.in(cities.get()));
                }

                if (locations.isPresent()) {
                        var locationId = root.get("location").get("id");
                        predicates.add(locationId.in(locations.get()));
                }

                if (code.isPresent()) {
                        var compositionCode = cb.lower(root.get("code"));
                        Predicate codeIsLike = cb.like(compositionCode.as(String.class),
                                        code.get().toLowerCase() + "%");

                        predicates.add(codeIsLike);
                }

                if (excludedCompositions.isPresent()) {
                        var compositionId = root.get("id");
                        Predicate codeIsNotIn = compositionId.in(excludedCompositions.get()).not();

                        predicates.add(codeIsNotIn);
                }

                Predicate finalCriteria = cb.and(predicates.toArray(new Predicate[0]));
                initialQuery.where(finalCriteria).orderBy(cb.asc(root.get("code")));

                int offset = FilterUtility.getOffset(filters.getOffset());

                TypedQuery<Composition> query = entityManager
                                .createQuery(initialQuery)
                                .setFirstResult(offset)
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
                        return lc.firstComposition().id != id ? lc.firstComposition() : lc.secondComposition();
                }).map(rc -> mapComposition(rc)).toList();
                Composition composition = getCompositionEntity(id);
                List<DeviceDTO> devices = composition.devices.stream().map(d -> mapDevice(d))
                                .sorted((o1, o2) -> o1.name().compareTo(o2.name())).toList();

                return new CompositionDetailsDTO(relatedCompositions, devices);
        }

        public Composition getCompositionEntity(long id) {
                TypedQuery<Composition> query = entityManager
                                .createQuery("SELECT c from Composition c WHERE c.id = :id", Composition.class)
                                .setParameter("id", id);

                return query.getSingleResult();
        }

        public CompositionDTO getComposition(Long id) {
                Composition composition = getCompositionEntity(id);

                return mapComposition(composition);
        }

        public List<LabeledValueDTO> getCompositionTypes(NameFilterDTO filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<CompositionType> criteriaQuery = cb.createQuery(CompositionType.class);
                Root<CompositionType> root = criteriaQuery.from(CompositionType.class);
                CriteriaQuery<CompositionType> initialQuery = criteriaQuery.select(root);

                if (filters.getName().isPresent()) {
                        var compositionName = root.get("name");
                        initialQuery.where(cb.like(compositionName.as(String.class), filters.getName().get() + "%"));
                }

                TypedQuery<CompositionType> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<LabeledValueDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new LabeledValueDTO(entity.id, entity.name))
                                .toList();

                return list;
        }

        public List<LabeledValueDTO> getCompositionStatuses(NameFilterDTO filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<CompositionStatus> criteriaQuery = cb.createQuery(CompositionStatus.class);
                Root<CompositionStatus> root = criteriaQuery.from(CompositionStatus.class);
                CriteriaQuery<CompositionStatus> initialQuery = criteriaQuery.select(root);

                if (filters.getName().isPresent()) {
                        var compositionStatusName = root.get("name");
                        initialQuery.where(
                                        cb.like(compositionStatusName.as(String.class), filters.getName().get() + "%"));
                }

                TypedQuery<CompositionStatus> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<LabeledValueDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new LabeledValueDTO(entity.id, entity.name))
                                .toList();

                return list;
        }

        public static DeviceDTO mapDevice(Device device) {
                StatusDTO status = new StatusDTO(device.status.id, device.status.name, device.status.isOperational,
                                device.status.isBroken, device.status.inMaintenance);

                return new DeviceDTO(device.id, device.name, device.code, status, device.creationAt,
                                device.composition.code);
        }

        public CompositionDTO mapComposition(Composition composition) {
                String code = composition.code;
                LabeledValueDTO location = new LabeledValueDTO(composition.location.id, composition.location.name);
                LabeledValueDTO type = new LabeledValueDTO(composition.type.id, composition.type.name);
                LabeledValueDTO city = new LabeledValueDTO(composition.location.city.id,
                                composition.location.city.name);
                int devicesSize = composition.devices.size();
                StatusDTO status = new StatusDTO(composition.status.id, composition.status.name,
                                composition.status.isOperational,
                                composition.status.isBroken, composition.status.inMaintenance);

                return new CompositionDTO(composition.id, location, type, city, code, devicesSize, status,
                                composition.coordinates, composition.description);
        }

        @Transactional
        public void linkCompositions(LinkedCompositionsDTO link) {
                Composition firstComposition = getCompositionEntity(link.firstId());
                Composition secondComposition = getCompositionEntity(link.secondId());
                LinkedCompositionId id = new LinkedCompositionId(link.firstId(), link.secondId());
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
                                .setParameter("firstId", link.firstId())
                                .setParameter("secondId", link.secondId());

                LinkedComposition linkedCompositions = query.getSingleResult();

                entityManager.remove(linkedCompositions);
        }

        @Transactional
        public void createDevice(BaseDeviceDTO newDevice) {
                Device device = new Device();

                createOrEditDevice(newDevice, device);
        }

        @Transactional
        public void editDevice(EditedDeviceDTO editedDevice) {
                Device device = entityManager.getReference(Device.class, editedDevice.getDeviceId());

                createOrEditDevice(editedDevice, device);
        }

        @Transactional
        public void createOrEditDevice(BaseDeviceDTO baseDevice, Device device) {
                Composition composition = entityManager.getReference(Composition.class, baseDevice.getCompositionId());
                DeviceStatus status = entityManager.getReference(DeviceStatus.class, baseDevice.getStatusId());

                device.setCode(baseDevice.getDeviceCode());
                device.setName(baseDevice.getDeviceName());
                device.setStatus(status);
                device.setComposition(composition);

                entityManager.merge(device);
        }

        public List<LabeledValueDTO> getDeviceStatuses(NameFilterDTO filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<DeviceStatus> criteriaQuery = cb.createQuery(DeviceStatus.class);
                Root<DeviceStatus> root = criteriaQuery.from(DeviceStatus.class);
                CriteriaQuery<DeviceStatus> initialQuery = criteriaQuery.select(root);

                if (filters.getName().isPresent()) {
                        var deviceStatusName = root.get("name");
                        initialQuery.where(cb.like(deviceStatusName.as(String.class), filters.getName().get() + "%"));
                }

                TypedQuery<DeviceStatus> query = entityManager
                                .createQuery(initialQuery)
                                .setMaxResults(CompositionService.LIMIT);

                List<LabeledValueDTO> list = query
                                .getResultList()
                                .stream()
                                .map(entity -> new LabeledValueDTO(entity.id, entity.name))
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
        public void createComposition(BaseCompositionDTO newComposition) {
                Composition composition = new Composition();

                createOrEditComposition(newComposition, composition);
        }

        @Transactional
        public void editComposition(EditedCompositionDTO editedComposition) {
                Composition composition = entityManager.getReference(Composition.class, editedComposition.getId());

                createOrEditComposition(editedComposition, composition);
        }

        @Transactional
        public void createOrEditComposition(BaseCompositionDTO dto, Composition composition) {
                Location location = entityManager.getReference(Location.class, dto.getLocationId());
                CompositionStatus status = entityManager.getReference(CompositionStatus.class, dto.getStatusId());
                CompositionType type = entityManager.getReference(CompositionType.class, dto.getTypeId());

                composition.setCode(dto.getCode());
                composition.setLocation(location);
                composition.setStatus(status);
                composition.setType(type);
                composition.setDescription(dto.getDescription());
                composition.setCoordinates(dto.getCoordinates());

                entityManager.merge(composition);
        }

        @Transactional
        public void deleteComposition(Long id) {
                entityManager.remove(entityManager.getReference(Composition.class, id));
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
                Device device = getDevice(id);

                entityManager.remove(device);
        }

        @Transactional
        private Device getDevice(Long deviceId) {
                TypedQuery<Device> query = entityManager
                                .createQuery("SELECT d from Device d WHERE d.id = :id", Device.class)
                                .setParameter("id", deviceId);

                return query.getSingleResult();
        }

        public DeviceDetailsDTO getDeviceDetails(Long deviceId) {
                Device device = getDevice(deviceId);
                Composition composition = device.composition;
                List<DeviceDateStatusDTO> timeline = getDeviceStatusTimeline(deviceId);

                return new DeviceDetailsDTO(mapDevice(device), mapComposition(composition), timeline);
        }

        private List<DeviceDateStatusDTO> getDeviceStatusTimeline(Long id) {
                LocalDate lastThirtyDays = LocalDate.now().minusDays(30);

                TypedQuery<DeviceDateStatusDTO> query = entityManager.createQuery(
                                "SELECT NEW DeviceDateStatusDTO(COUNT(dsr.id) as occurrences,  cast(dsr.creationAt as LocalDate) as date) "
                                                +
                                                "from DeviceStatusRecord dsr WHERE dsr.device.id = :id " +
                                                "AND dsr.creationAt > :lastThirtyDays " +
                                                "AND dsr.status.isOperational != true " +
                                                "GROUP BY cast(dsr.creationAt as LocalDate)",
                                DeviceDateStatusDTO.class)
                                .setParameter("id", id)
                                .setParameter("lastThirtyDays", lastThirtyDays);

                List<DeviceDateStatusDTO> list = query.getResultList();
                return list;
        }

        public List<DeviceDTO> getDevices(NameFilterDTO filters) {
                CriteriaBuilder cb = entityManager.getCriteriaBuilder();
                CriteriaQuery<Device> criteriaQuery = cb.createQuery(Device.class);
                Root<Device> root = criteriaQuery.from(Device.class);
                CriteriaQuery<Device> initialQuery = criteriaQuery.select(root);

                Predicate[] filterPredicates = FilterUtility.getFilterPredicates(filters, cb, root);
                Predicate finalCriteria = cb.and(filterPredicates);
                initialQuery.orderBy(cb.asc(root.get("name"))).where(finalCriteria);

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

}
