package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public class OriginDTO {
    @NotNull
    private String country;

    @NotNull
    private String city;

    @NotNull
    private String location;

    @NotNull
    private String composition;

    public OriginDTO(String country, String city, String location, String composition) {
        this.country = country;
        this.city = city;
        this.location = location;
        this.composition = composition;
    }

    public String getCountry() {
        return country;
    }

    public String getCity() {
        return city;
    }

    public String getLocation() {
        return location;
    }

    public String getComposition() {
        return composition;
    }

    public OriginDTO getOrigin() {
        return this;
    }
}
