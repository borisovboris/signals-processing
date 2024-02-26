package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public class BaseDeviceDTO {
    @NotNull
    private long compositionId;

    @NotNull
    private String deviceCode;

    @NotNull
    private String deviceName;

    @NotNull
    private long statusId;

    public BaseDeviceDTO(long compositionId, String deviceCode, String deviceName,
            long statusId) {
        this.compositionId = compositionId;
        this.deviceCode = deviceCode;
        this.deviceName = deviceName;
        this.statusId = statusId;
    }

    public long getCompositionId() {
        return compositionId;
    }

    public void setCompositionId(long compositionId) {
        this.compositionId = compositionId;
    }

    public String getDeviceCode() {
        return deviceCode;
    }

    public void setDeviceCode(String deviceCode) {
        this.deviceCode = deviceCode;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public long getStatusId() {
        return statusId;
    }

    public void setStatusId(long statusId) {
        this.statusId = statusId;
    }

}
