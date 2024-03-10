package com.signalsprocessing.engine.transfer.events;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public class OriginDevicesDTO extends OriginDTO {
    @NotNull
    private List<String> names;

    public OriginDevicesDTO(List<String> names, String country, String city, String location, String composition) {
       super(country, city, location, composition);
       this.names = names;
    }

    public List<String> getNames() {
        return names;
    }

}
