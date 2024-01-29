package com.signalsprocessing.engine.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.signalsprocessing.engine.models.Composition;
import com.signalsprocessing.engine.models.Device;
import com.signalsprocessing.engine.models.DeviceStatus;
import com.signalsprocessing.engine.models.LinkedComposition;
import com.signalsprocessing.engine.models.LinkedCompositionId;

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

    public List<CompositionDTO> readCompositions(Optional<CompositionFiltersDTO> filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Composition> criteriaQuery = cb.createQuery(Composition.class);
        Root<Composition> root = criteriaQuery.from(Composition.class);
        // This is the query that selects all rows from the table
        CriteriaQuery<Composition> initialQuery = criteriaQuery.select(root);

        if (filters.isPresent()) {
            CompositionFiltersDTO presentFilters = filters.get();
            List<String> cityNames = presentFilters.cityNames();
            List<String> locationNames = presentFilters.locationNames();
            List<String> excludedCompositionCodes = presentFilters.excludedCompositionCodes();
            String code = presentFilters.code();

            if (cityNames != null) {
                var cityName = root.get("location").get("city").get("name");
                initialQuery.where(cityName.in(cityNames));
            }

            if (locationNames != null) {
                var locationName = root.get("location").get("name");
                initialQuery.where(locationName.in(locationNames));
            }

            if (code != null && excludedCompositionCodes != null) {
                var compositionCode = root.get("code");
                Predicate codeIsLike = cb.like(compositionCode.as(String.class), code + "%");
                Predicate codeIsNotIn = compositionCode.in(excludedCompositionCodes).not();

                initialQuery.where(cb.and(codeIsLike, codeIsNotIn));
            }
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

    public DeviceDTO mapDevice(Device device) {
        StatusDTO status = new StatusDTO(device.status.name, device.status.isOperational,
                device.status.isBroken, device.status.inMaintenance);

        return new DeviceDTO(device.id, device.name, status, device.creationAt);
    }

    public CompositionDTO mapComposition(Composition composition) {
        String code = composition.code;
        String locationName = composition.location.name;
        int devicesSize = composition.devices.size();
        StatusDTO status = new StatusDTO(composition.status.name, composition.status.isOperational,
                composition.status.isBroken, composition.status.inMaintenance);

        return new CompositionDTO(composition.id, locationName, code, devicesSize, status);
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
                        "WHERE (lc.firstComposition.id = :firstId AND lc.secondComposition.id = :secondId) " +
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

        DeviceStatus deviceStatus = new DeviceStatus();
        deviceStatus.setName(newDevice.statusName);
        deviceStatus.setOperational(newDevice.operational);
        deviceStatus.setInMaintenance(newDevice.inMaintenance);
        deviceStatus.setBroken(newDevice.broken);

        entityManager.merge(deviceStatus);

        Device device = new Device();
        device.setCode(newDevice.deviceCode);
        device.setName(newDevice.deviceName);
        device.setStatus(deviceStatus);
        device.setComposition(composition);

        entityManager.merge(device);
    }

    @Transactional
    public void deleteDevice(Long id) {
        TypedQuery<Device> query = entityManager.createQuery("SELECT d from Device d WHERE d.id = :id", Device.class)
        .setParameter("id", id);

        Device device = query.getSingleResult();

        entityManager.remove(device);
    }

    public record CompositionDTO(@NotNull long id, @NotNull String locationName, @NotNull String code,
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

    public record CompositionFiltersDTO(@Nullable List<String> cityNames, @Nullable List<String> locationNames,
            @Nullable List<String> excludedCompositionCodes, @Nullable String code) {
    }

    public record DeviceDTO(@NotNull long id, @NotNull String name,
            @NotNull StatusDTO status, @NotNull Date creationAt) {
    }

    public record LinkedCompositionsDTO(@NotNull long firstId, @NotNull long secondId) {
    }

    public record NewDeviceDTO(@NotNull long compositionId, @NotNull String deviceCode, @NotNull String deviceName,
            @NotNull String statusName,
            @NotNull boolean operational, @NotNull boolean inMaintenance, @NotNull boolean broken) {
    }
}
