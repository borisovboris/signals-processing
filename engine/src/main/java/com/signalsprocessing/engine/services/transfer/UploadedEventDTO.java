package com.signalsprocessing.engine.services.transfer;

import java.util.List;
import java.util.Optional;

import jakarta.validation.constraints.NotNull;

public class UploadedEventDTO {
    @NotNull
    private String name;

    @NotNull
    private List<OriginDevicesDTO> affectedDevices;

    private Optional<String> newDevicesStatusName;

    public UploadedEventDTO(String name, Optional<String> newDevicesStatusName,
            List<OriginDevicesDTO> affectedDevices) {
        this.name = name;
        this.newDevicesStatusName = newDevicesStatusName;
        this.affectedDevices = affectedDevices;
    }

    public String getName() {
        return name;
    }

    public List<OriginDevicesDTO> getAffectedDevices() {
        return affectedDevices;
    }

    public Optional<String> getNewDevicesStatusName() {
        return newDevicesStatusName;
    }
}
