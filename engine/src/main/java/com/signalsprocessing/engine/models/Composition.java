package com.signalsprocessing.engine.models;

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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Table(uniqueConstraints = { @UniqueConstraint(name = "UNIQUE_COMPOSITION_CODE", columnNames = { "code", "location_id" }) })
@Entity
public class Composition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 255)
    public String code;

    @Column(length = 255)
    public String coordinates;

    @Column(length = 255)
    public String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "type_id", nullable = false)
    public CompositionType type;

    @ManyToOne(optional = false)
    @JoinColumn(name = "status_id", nullable = false)
    public CompositionStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    public Location location;

    @OneToMany(mappedBy = "composition", cascade = CascadeType.ALL)
    public Set<Device> devices;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    public LocalDate creationAt;

    public void setCode(String code) {
        this.code = code;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setType(CompositionType type) {
        this.type = type;
    }

    public void setStatus(CompositionStatus status) {
        this.status = status;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
