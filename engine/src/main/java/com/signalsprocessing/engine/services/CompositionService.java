package com.signalsprocessing.engine.services;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.signalsprocessing.engine.models.Composition;

import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
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
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Composition> criteriaQuery = criteriaBuilder.createQuery(Composition.class);
        Root<Composition> root = criteriaQuery.from(Composition.class);
        // This is the query that selects all rows from the table
        CriteriaQuery<Composition> initialQuery = criteriaQuery.select(root);

        if (filters.isPresent()) {
            CompositionFiltersDTO presentFilters = filters.get();
            List<String> cityNames = presentFilters.cityNames();
            List<String> locationNames = presentFilters.locationNames();

            if (cityNames != null) {
                var cityName = root.get("location").get("city").get("name");
                initialQuery.where(cityName.in(cityNames));
            }

            if (locationNames != null) {
                var locationName = root.get("location").get("name");
                initialQuery.where(locationName.in(locationNames));
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
        CompositionDTO composition = getComposition(id);

        return new CompositionDetailsDTO(composition, relatedCompositions);
    }

    public CompositionDTO getComposition(long id) {
        TypedQuery<Composition> query = entityManager
                .createQuery("SELECT c from Composition c WHERE c.id = :id", Composition.class)
                .setParameter("id", id);
        Composition composition = query.getSingleResult();

        return mapComposition(composition);
    }

    public record CompositionDTO(@NotNull long id, @NotNull String type, @NotNull int devicesSize, @NotNull StatusDTO status) {
    }

    public CompositionDTO mapComposition(Composition composition) {
        String type = composition.type.name;
        int devicesSize = composition.devices.size();
        StatusDTO status = new StatusDTO(composition.status.name, composition.status.isOperational,
                composition.status.isBroken, composition.status.inMaintenance);

        return new CompositionDTO(composition.id, type, devicesSize, status);
    }

    public record StatusDTO(@NotNull String name, @NotNull boolean isOperational, @NotNull boolean isBroken,
            @NotNull boolean inMaintenance) {
    }

    public record LinkedCompositions(Composition firstComposition, Composition secondComposition) {
    }

    public record CompositionDetailsDTO(CompositionDTO composition, List<CompositionDTO> relatedCompositions) {
    }

    public record CompositionFiltersDTO(@Nullable List<String> cityNames, @Nullable List<String> locationNames) {
    }

}
