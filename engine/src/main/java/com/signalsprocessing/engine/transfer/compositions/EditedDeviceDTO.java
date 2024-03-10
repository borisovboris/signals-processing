package com.signalsprocessing.engine.transfer.compositions;

import jakarta.validation.constraints.NotNull;

public class EditedDeviceDTO extends BaseDeviceDTO {
    @NotNull
    private long deviceId;

    public EditedDeviceDTO(long compositionId, long deviceId, String deviceCode,
            String deviceName,
            long statusId) {
        super(compositionId, deviceCode, deviceName, statusId);
        this.deviceId = deviceId;
    }

    public long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(long deviceId) {
        this.deviceId = deviceId;
    }
}
