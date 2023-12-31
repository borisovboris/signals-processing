package com.example.signalsprocessing.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;

@Entity
public class LinkedComposition {
    @EmbeddedId
    private LinkedCompositionId id;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("firstCompositionId")
    private Composition firstComposition;

    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("secondCompositionId")
    private Composition secondComposition;
}
