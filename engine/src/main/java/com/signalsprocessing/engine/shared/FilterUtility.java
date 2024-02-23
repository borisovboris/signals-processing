package com.signalsprocessing.engine.shared;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public abstract class FilterUtility {
    public static Predicate[] getFilterPredicates(NameFilterDTO filters, CriteriaBuilder cb, Root<?> root) {
        List<Predicate> predicates = new ArrayList<>();

        if (filters.getName().isPresent()) {
            var nameField = root.get("name");
            predicates.add(cb.like(nameField.as(String.class), filters.getName().get() + "%"));
        }

        if (filters.getExludedItemIds().isPresent()) {
            var idField = root.get("id");
            Predicate notInIds = idField.in(filters.getExludedItemIds().get()).not();
            predicates.add(notInIds);
        }

        return predicates.toArray(new Predicate[0]);
    }

    public static Integer getOffset(Optional<Integer> offset) {
        if (offset.isPresent()) {
            return offset.get();
        }

        return 0;
    }
}
