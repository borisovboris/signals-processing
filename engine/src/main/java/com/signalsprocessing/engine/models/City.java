package com.signalsprocessing.engine.models;

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

@Entity
@Table(uniqueConstraints = { @UniqueConstraint(name = "UNIQUE_NAME", columnNames = { "country_id", "name" }),
        @UniqueConstraint(name = "UNIQUE_POSTAL_CODE", columnNames = { "country_id", "postal_code" }) })
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, length = 16)
    public String postalCode;

    @Column(nullable = false, length = 255)
    public String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "country_id", nullable = false)
    public Country country;

    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL)
    public Set<Location> locations;

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    
}
