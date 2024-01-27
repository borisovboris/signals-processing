package com.signalsprocessing.engine.models;

import jakarta.persistence.CascadeType;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;

@Entity
public class LinkedComposition {
    @EmbeddedId
    private LinkedCompositionId id;

    @ManyToOne()
    @MapsId("firstCompositionId")
    private Composition firstComposition;

    @ManyToOne()
    @MapsId("secondCompositionId")
    private Composition secondComposition;

    public void setId(LinkedCompositionId id) {
        this.id = id;
    }

    public void setFirstComposition(Composition firstComposition) {
        this.firstComposition = firstComposition;
    }

    public void setSecondComposition(Composition secondComposition) {
        this.secondComposition = secondComposition;
    }
}
