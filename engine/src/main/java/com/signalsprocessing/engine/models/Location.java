package com.signalsprocessing.engine.models;

import java.util.Date;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, length = 255)
    public String code;

    @Column(nullable = false, length = 255)
    public String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "city_id", nullable = false)
    public City city;

    @Column(nullable = false, length = 255)
    public String address;

    @Column(length = 255)
    public String coordinates;

    @Column(length = 255)
    public String description;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    public Date creationAt;

    @Column(columnDefinition = "boolean default true")
    public boolean isOperational = true;

    @OneToMany(mappedBy = "location")
    public Set<Composition> compositions;
}
