package com.signalsprocessing.engine.models;

import java.time.LocalDate;
import java.util.Optional;
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

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "event")
    private Set<EventDevice> devices;

    @Column(columnDefinition = "boolean default false")
    public boolean manualInsert = false;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    public LocalDate creationAt;

    @Column(insertable = false, updatable = false, nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    public LocalDate eventCreationAt;

    public void setType(EventType type) {
        this.type = type;
    }

    public void setManualInsert(boolean manualInsert) {
        this.manualInsert = manualInsert;
    }

    public Optional<Signal> getSignal() {
        return Optional.ofNullable(this.signal);
    }

    public void setSignal(Signal signal) {
        this.signal = signal;
    }

}
