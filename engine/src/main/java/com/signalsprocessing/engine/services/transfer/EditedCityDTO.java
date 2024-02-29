package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public class EditedCityDTO extends BaseCityDTO {
    @NotNull
    private Long id;

    public EditedCityDTO(Long id, Long countryId, String name, String postalCode) {
        super(countryId, name, postalCode);
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
