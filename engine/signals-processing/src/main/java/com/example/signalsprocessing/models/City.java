package com.example.signalsprocessing.models;

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
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 16)
    private String postalCode;

    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @OneToMany(mappedBy="city", cascade = CascadeType.ALL)
    private Set<Location> locations;
}
