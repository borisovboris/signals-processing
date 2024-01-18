package com.signalsprocessing.engine.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CompositionStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 255)
    public String name;

    @Column(columnDefinition = "boolean default true")
    public boolean isOperational;

    @Column(columnDefinition = "boolean default false")
    public boolean isBroken;

    @Column(columnDefinition = "boolean default false")
    public boolean inMaintenance;
}
