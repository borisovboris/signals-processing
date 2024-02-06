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
    public Date creationAt;
}
