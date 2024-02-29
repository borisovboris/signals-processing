package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public class BaseCityDTO {
    @NotNull
    private Long countryId;

    @NotNull
    private String name;

    @NotNull
    private String postalCode;

    public BaseCityDTO(Long countryId, String name, String postalCode) {
        this.countryId = countryId;
        this.name = name;
        this.postalCode = postalCode;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

}
