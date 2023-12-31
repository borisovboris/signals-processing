package com.example.signalsprocessing.models;

import jakarta.persistence.Embeddable;

@Embeddable
public class LinkedDeviceId {
    private Long firstDeviceId;
    private Long secondDeviceId;

    LinkedDeviceId(Long firstDeviceId, Long secondDeviceId) {
        this.firstDeviceId = firstDeviceId;
        this.secondDeviceId = secondDeviceId;
    }

    public Long getFirstDeviceId() {
        return firstDeviceId;
    }

    public void setFirstDeviceId(Long firstDeviceId) {
        this.firstDeviceId = firstDeviceId;
    }

    public Long getSecondDeviceId() {
        return secondDeviceId;
    }

    public void setSecondDeviceId(Long secondDeviceId) {
        this.secondDeviceId = secondDeviceId;
    }

}
