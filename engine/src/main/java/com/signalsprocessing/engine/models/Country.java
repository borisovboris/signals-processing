package com.signalsprocessing.engine.models;

import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 255)
    public String name;

    @OneToMany(mappedBy="country", cascade = CascadeType.ALL)
    public Set<City> cities;

    public void setName(String name) {
        this.name = name;
    }
}
