package com.signalsprocessing.engine.models;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class DeviceStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @Column(columnDefinition = "boolean default true")
    private boolean isOperational = true;

    @Column(columnDefinition = "boolean default true")
    private boolean isBroken = false;

    @Column(columnDefinition = "boolean default true")
    private boolean inMaintenance = false;

    @OneToMany(mappedBy = "status")
    private Set<Device> devices;

    @OneToMany(mappedBy = "status")
    private Set<DeviceStatusRecord> records;
}
