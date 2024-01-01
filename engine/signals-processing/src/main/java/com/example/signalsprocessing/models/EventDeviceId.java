package com.example.signalsprocessing.models;

import jakarta.persistence.Embeddable;

@Embeddable
public class EventDeviceId {
    private Long eventId;
    private Long deviceId;

    public EventDeviceId(Long eventId, Long deviceId) {
        this.eventId = eventId;
        this.deviceId = deviceId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

}
