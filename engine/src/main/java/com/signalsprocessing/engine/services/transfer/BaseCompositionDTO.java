package com.signalsprocessing.engine.services.transfer;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public class BaseCompositionDTO {
    @NotNull
    String code;

    @NotNull
    Long locationId;

    @NotNull
    Long typeId;

    @NotNull
    Long statusId;

    @Nullable
    String coordinates;

    @Nullable
    String description;

    public BaseCompositionDTO(String code, Long locationId, Long typeId,
            Long statusId, String coordinates, String description) {
        this.code = code;
        this.locationId = locationId;
        this.typeId = typeId;
        this.statusId = statusId;
        this.coordinates = coordinates;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public Long getTypeId() {
        return typeId;
    }

    public void setTypeId(Long typeId) {
        this.typeId = typeId;
    }

    public Long getStatusId() {
        return statusId;
    }

    public void setStatusId(Long statusId) {
        this.statusId = statusId;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
