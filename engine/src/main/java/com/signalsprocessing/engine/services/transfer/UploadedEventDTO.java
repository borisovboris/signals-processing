package com.signalsprocessing.engine.services.transfer;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public class UploadedEventDTO {
    @NotNull
    private String name;

    @NotNull
    private List<OriginDevicesDTO> affectedDevices;

    public UploadedEventDTO(String name, List<OriginDevicesDTO> affectedDevices) {
        this.name = name;
        this.affectedDevices = affectedDevices;
    }

    public String getName() {
        return name;
    }

    public List<OriginDevicesDTO> getAffectedDevices() {
        return affectedDevices;
    }

}
