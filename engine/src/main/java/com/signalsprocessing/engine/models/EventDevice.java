package com.signalsprocessing.engine.models;

import jakarta.persistence.CascadeType;
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
}
