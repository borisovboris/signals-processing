package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public class BaseLocationDTO {
    @NotNull
    private Long cityId;

    @NotNull
    private String name;

    @NotNull
    private String address;

    private String coordinates;

    private String description;

    public BaseLocationDTO(Long cityId, String name, String address, String coordinates,
            String description) {
        this.cityId = cityId;
        this.name = name;
        this.address = address;
        this.coordinates = coordinates;
        this.description = description;
    }

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
