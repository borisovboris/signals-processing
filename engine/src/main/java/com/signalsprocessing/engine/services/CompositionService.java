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

    public List<CompositionDTO> readCompositions(Optional< CompositionFiltersDTO> filters) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Composition> criteriaQuery = criteriaBuilder.createQuery(Composition.class);
        Root<Composition> root = criteriaQuery.from(Composition.class);
        CriteriaQuery<Composition> select = criteriaQuery.select(root);

        if (filters.isPresent()) {
            List<String> cityNames = filters.get().cityNames();

            if (cityNames != null) {
                var cityName = root.get("location").get("city").get("name");
                select.where(cityName.in(cityNames));
            }
        }

        TypedQuery<Composition> query = entityManager
                .createQuery(select)
                .setMaxResults(CompositionService.LIMIT);
        List<CompositionDTO> list = query
                .getResultList()
                .stream()
                .map(entity -> mapComposition(entity))
                .toList();

        return list;
    }

    public record CompositionDTO(@NotNull String type, @NotNull int devicesSize, @NotNull StatusDTO status) {
    }

    public CompositionDTO mapComposition(Composition composition) {
        String type = composition.type.name;
        int devicesSize = composition.devices.size();
        StatusDTO status = new StatusDTO(composition.status.name, composition.status.isOperational,
                composition.status.isBroken, composition.status.inMaintenance);

        return new CompositionDTO(type, devicesSize, status);
    }

    public record StatusDTO(@NotNull String name, @NotNull boolean isOperational, @NotNull boolean isBroken,
            @NotNull boolean inMaintenance) {
    }

    public record CompositionFiltersDTO(@Nullable List<String> cityNames) {
    }

}
