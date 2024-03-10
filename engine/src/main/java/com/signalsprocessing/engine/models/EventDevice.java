package com.signalsprocessing.engine.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;

@Entity
public class EventDevice {
    @EmbeddedId
    private EventDeviceId id;

    @ManyToOne()
    @MapsId("eventId")
    public Event event;

    @ManyToOne()
    @MapsId("deviceId")
    public Device device;

    public void setId(EventDeviceId id) {
        this.id = id;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public void setDevice(Device device) {
        this.device = device;
    }
}
