package com.signalsprocessing.engine.transfer.countries;

import jakarta.validation.constraints.NotNull;

public class EditedLocationDTO extends BaseLocationDTO {
    @NotNull
    private Long id;

    public EditedLocationDTO(Long id, Long cityId, String name, String address, String coordinates,
            String description, boolean isOperational) {
        super(cityId, name, address, coordinates, description, isOperational);
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
