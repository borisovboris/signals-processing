package com.signalsprocessing.engine.services;

import java.util.Date;
import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

import com.signalsprocessing.engine.models.Event;
import com.signalsprocessing.engine.models.Signal;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.validation.constraints.NotNull;

@Component
@ComponentScan
public class EventService {
    private EntityManager entityManager;
    private static final int LIMIT = 25;

    public EventService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<EventDTO> getEvents() {
        TypedQuery<Event> query = entityManager.createQuery("SELECT e FROM Event e", Event.class);
        List<EventDTO> events = query.getResultList().stream().map(e -> mapEvent(e)).toList();

        return events;

    }

    public EventDTO mapEvent(Event event) {
        SignalDTO signal = mapSignal(event.signal);

        return new EventDTO(event.id, event.type.name, signal, event.manualInsert, event.eventCreationAt);
    }

    public SignalDTO mapSignal(Signal signal) {
        return new SignalDTO(signal.id, signal.value, signal.creationAt);
    }

    public record EventDTO(@NotNull long id, @NotNull String typeName, @NotNull SignalDTO signal,
            @NotNull boolean manualInsert, @NotNull Date eventCreationAt) {
    }

    public record SignalDTO(@NotNull long id, @NotNull BigDecimal value, @NotNull Date creationAt) {
    }
}
