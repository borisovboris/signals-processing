package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public class OriginDeviceDTO extends OriginDTO {
    @NotNull
    private String name;

    public OriginDeviceDTO(String name, String country, String city, String location, String composition) {
       super(country, city, location, composition);
       this.name = name;
    }

    public String getName() {
        return name;
    }
}
