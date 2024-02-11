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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Table(uniqueConstraints = { @UniqueConstraint(name = "UNIQUE_LOCATION_NAME", columnNames = { "city_id", "name" }) })
@Entity
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    // TODO Consider getting rid of code, unnecessary complication
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

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    public Date creationAt;

    @Column(columnDefinition = "boolean default true")
    public boolean isOperational;

    @OneToMany(mappedBy = "location")
    public Set<Composition> compositions;

    public void setCode(String code) {
        this.code = code;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
