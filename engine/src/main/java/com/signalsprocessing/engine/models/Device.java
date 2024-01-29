package com.signalsprocessing.engine.models;

import java.util.Date;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 255)
    public String code;

    @Column(nullable = false, unique = true, length = 255)
    public String name;

    // TODO: Figure out if each device should have its own status
    // or use general statuses
    @ManyToOne(optional = false)
    @JoinColumn(name = "status_id")
    public DeviceStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "composition_id")
    public Composition composition;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "device")
    private Set<DeviceStatusRecord> statusRecords;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    public Date creationAt;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DeviceStatus getStatus() {
        return status;
    }

    public void setStatus(DeviceStatus status) {
        this.status = status;
    }

    public Composition getComposition() {
        return composition;
    }

    public void setComposition(Composition composition) {
        this.composition = composition;
    }
}
