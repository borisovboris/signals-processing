package com.signalsprocessing.engine.services.transfer;

import java.math.BigDecimal;
import java.util.List;

public class UploadedSignalDTO {
    private String description;
    private BigDecimal value;
    private OriginDeviceDTO sourceDevice;
    private List<UploadedEventDTO> events;

    public UploadedSignalDTO(BigDecimal value, String description, OriginDeviceDTO sourceDevice, List<UploadedEventDTO> events) {
        this.description = description;
        this.sourceDevice = sourceDevice;
        this.events = events;
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public OriginDeviceDTO getSourceDevice() {
        return sourceDevice;
    }

    public List<UploadedEventDTO> getEvents() {
        return events;
    }

    public BigDecimal getValue() {
        return value;
    }

}
