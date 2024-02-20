package com.signalsprocessing.engine.models;

import java.util.Date;
import java.util.Optional;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "type_id", nullable = false)
    public EventType type;

    @ManyToOne(optional = true)
    @JoinColumn(name = "signal_id", nullable = true)
    private Signal signal;

    @Column(columnDefinition = "boolean default false")
    public boolean manualInsert = false;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    public Date creationAt;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    public Date eventCreationAt;

    public void setType(EventType type) {
        this.type = type;
    }

    public void setManualInsert(boolean manualInsert) {
        this.manualInsert = manualInsert;
    }

    public Optional<Signal> getSignal() {
        return Optional.ofNullable(this.signal);
    }
}
