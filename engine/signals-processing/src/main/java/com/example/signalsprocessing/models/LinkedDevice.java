package com.example.signalsprocessing.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;

@Entity
public class LinkedDevice {
    @EmbeddedId
    private LinkedDeviceId id;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("firstDeviceId")
    private Device firstDevice;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("secondDeviceId")
    private Device secondDevice;
}
