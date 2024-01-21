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
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 255)
    public String name;

    @Column(columnDefinition = "boolean default true")
    public boolean isOperational = true;

    @Column(columnDefinition = "boolean default true")
    public boolean isBroken = false;

    @Column(columnDefinition = "boolean default true")
    public boolean inMaintenance = false;

    @OneToMany(mappedBy = "status")
    public Set<Device> devices;

    @OneToMany(mappedBy = "status")
    public Set<DeviceStatusRecord> records;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isOperational() {
        return isOperational;
    }

    public void setOperational(boolean isOperational) {
        this.isOperational = isOperational;
    }

    public boolean isBroken() {
        return isBroken;
    }

    public void setBroken(boolean isBroken) {
        this.isBroken = isBroken;
    }

    public boolean isInMaintenance() {
        return inMaintenance;
    }

    public void setInMaintenance(boolean inMaintenance) {
        this.inMaintenance = inMaintenance;
    }
}
