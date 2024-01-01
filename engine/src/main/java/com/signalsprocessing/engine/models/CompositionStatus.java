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
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @Column(columnDefinition = "boolean default true")
    private boolean isOperational = true;

    @Column(columnDefinition = "boolean default true")
    private boolean isBroken = false;

    @Column(columnDefinition = "boolean default true")
    private boolean inMaintenance = false;
}
