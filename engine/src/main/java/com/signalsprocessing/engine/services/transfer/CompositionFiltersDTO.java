package com.signalsprocessing.engine.services.transfer;

import java.util.List;
import java.util.Optional;

import com.signalsprocessing.engine.shared.OffsetConstraint;

import jakarta.annotation.Nullable;

public class CompositionFiltersDTO extends OffsetConstraint {
    @Nullable
    private List<Long> cities;

    @Nullable
    private List<Long> locations;

    @Nullable
    private List<Long> excludedCompositions;

    @Nullable
    private String code;

    public CompositionFiltersDTO(List<Long> cities, List<Long> locations,
            List<Long> excludedCompositions, String code, Integer offset) {
        super(offset);
        this.cities = cities;
        this.locations = locations;
        this.excludedCompositions = excludedCompositions;
        this.code = code;
    }

    public Optional<List<Long>> getCities() {
        return Optional.ofNullable(cities);
    }

    public void setCities(List<Long> cities) {
        this.cities = cities;
    }

    public Optional<List<Long>> getLocations() {
        return Optional.ofNullable(locations);
    }

    public void setLocations(List<Long> locations) {
        this.locations = locations;
    }

    public Optional<List<Long>> getExcludedCompositions() {
        return Optional.ofNullable(excludedCompositions);
    }

    public void setExcludedCompositions(List<Long> excludedCompositions) {
        this.excludedCompositions = excludedCompositions;
    }

    public Optional<String> getCode() {
        return Optional.ofNullable(code);
    }

    public void setCode(String code) {
        this.code = code;
    }

}
