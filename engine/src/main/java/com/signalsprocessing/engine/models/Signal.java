package com.signalsprocessing.engine.models;

import java.math.BigDecimal;
import java.time.LocalDate;
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
public class Signal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    public Device device;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "signal")
    private Set<Event> events;

    @Column
    public BigDecimal value;

    @Column(length = 255)
    public String description;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    public LocalDate creationAt;

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDevice(Device device) {
        this.device = device;
    }
}
