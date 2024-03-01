package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public class EditedLocationDTO extends BaseLocationDTO {
    @NotNull
    private Long id;

    public EditedLocationDTO(Long id, Long cityId, String name, String address, String coordinates,
            String description) {
        super(cityId, name, address, coordinates, description);
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
