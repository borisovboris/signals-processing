package com.example.signalsprocessing.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;

@Entity
public class EventDevice {
    @EmbeddedId
    private EventDeviceId id;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("eventId")
    private Event event;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("deviceId")
    private Device device;
}
