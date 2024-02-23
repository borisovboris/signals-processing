package com.signalsprocessing.engine.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.signalsprocessing.engine.models.Device;
import com.signalsprocessing.engine.models.Event;
import com.signalsprocessing.engine.models.EventDevice;
import com.signalsprocessing.engine.models.EventDeviceId;
import com.signalsprocessing.engine.models.EventType;
import com.signalsprocessing.engine.models.Signal;
import com.signalsprocessing.engine.services.CompositionService.DeviceDTO;

import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;

@Component
@ComponentScan
public class EventService {
    private EntityManager entityManager;
    private static final int LIMIT = 25;

    public EventService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<EventDTO> getEvents(EventFiltersDTO filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Event> cq = cb.createQuery(Event.class);
        Root<Event> root = cq.from(Event.class);
        CriteriaQuery<Event> initialQuery = cq.select(root);

        List<Predicate> predicates = new ArrayList<>();

        if (filters.eventTypeIds.isPresent()) {
            var eventTypeId = root.get("type").get("id");
            Predicate eventTypeInIds = eventTypeId.in(filters.eventTypeIds.get());
            predicates.add(eventTypeInIds);
        }

        if (filters.startDate.isPresent()) {
            var eventCreationDate = root.get("eventCreationAt").as(java.time.LocalDate.class);
            Predicate eventAfterDate = cb.greaterThanOrEqualTo(eventCreationDate, cb.literal(filters.startDate.get()));
            predicates.add(eventAfterDate);
        }

        if (filters.endDate.isPresent()) {
            var eventCreationDate = root.get("eventCreationAt").as(java.time.LocalDate.class);
            Predicate eventBeforeDate = cb.lessThanOrEqualTo(eventCreationDate, cb.literal(filters.endDate.get()));
            predicates.add(eventBeforeDate);
        }

        if (filters.manuallyInserted.isPresent()) {
            var eventInsertion = root.get("manualInsert").as(Boolean.class);
            Predicate isManualInsert = cb.equal(eventInsertion, cb.literal(filters.manuallyInserted.get()));
            predicates.add(isManualInsert);
        }

        Predicate finalCriteria = cb.and(predicates.toArray(new Predicate[0]));
        initialQuery.where(finalCriteria);

        TypedQuery<Event> query = entityManager.createQuery(initialQuery)
                .setMaxResults(LIMIT);
        List<EventDTO> events = query.getResultList().stream().map(e -> mapEvent(e)).toList();

        return events;
    }

    public EventDetailsDTO getEventDetails(long id) {
        TypedQuery<Event> eventQuery = entityManager.createQuery("SELECT e FROM Event e WHERE e.id = :id", Event.class)
                .setParameter("id", id);
        Event event = eventQuery.getSingleResult();
        SignalDTO signal = mapSignal(event.getSignal());
        EventDTO eventDto = mapEvent(event);

        TypedQuery<EventDevice> eventDeviceQuery = entityManager
                .createQuery("SELECT ed FROM EventDevice ed WHERE ed.event.id = :id", EventDevice.class)
                .setParameter("id", id);
        List<DeviceDTO> eventDevices = eventDeviceQuery.getResultList().stream()
                .map(ed -> CompositionService.mapDevice(ed.device)).toList();

        return new EventDetailsDTO(eventDto, signal, eventDevices);
    }

    public List<EventTypeDTO> getEventTypes(NameFilterDTOs filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<EventType> criteriaQuery = cb.createQuery(EventType.class);
        Root<EventType> root = criteriaQuery.from(EventType.class);
        CriteriaQuery<EventType> initialQuery = criteriaQuery.select(root);

        Optional<String> name = filters.name;

        if (name.isPresent()) {
            var eventTypeName = root.get("name");
            initialQuery.where(cb.like(eventTypeName.as(String.class), name.get() + "%"));
        }

        TypedQuery<EventType> query = entityManager
                .createQuery(initialQuery)
                .setMaxResults(EventService.LIMIT);

        List<EventTypeDTO> list = query
                .getResultList()
                .stream()
                .map(entity -> new EventTypeDTO(entity.id, entity.name))
                .toList();

        return list;
    }

    @Transactional
    public void createEvent(NewEventDTO newEvent) {
        EventType type = entityManager.getReference(EventType.class, newEvent.eventTypeId);

        TypedQuery<Device> query = entityManager
                .createQuery("SELECT d FROM Device d WHERE d.id in :deviceIds", Device.class)
                .setParameter("deviceIds", newEvent.deviceIds);
        List<Device> devices = query.getResultList();

        Event event = new Event();
        event.setType(type);
        event.setManualInsert(true);

        for (Device device : devices) {
            EventDevice eventDevice = new EventDevice();
            EventDeviceId id = new EventDeviceId(event.id, device.id);
            eventDevice.setId(id);
            eventDevice.setDevice(device);
            eventDevice.setEvent(event);

            entityManager.persist(eventDevice);
        }
    }

    public EventDTO mapEvent(Event event) {
        return new EventDTO(event.id, event.type.name, event.manualInsert, event.eventCreationAt);
    }

    public SignalDTO mapSignal(Optional<Signal> signal) {
        if (signal.isEmpty()) {
            return null;
        }

        return new SignalDTO(signal.get().id, signal.get().value, signal.get().creationAt);
    }

    public record EventDTO(@NotNull long id, @NotNull String typeName,
            @NotNull boolean manualInsert, @NotNull LocalDate eventCreationAt) {
    }

    public record EventDetailsDTO(@NotNull EventDTO event, @Nullable SignalDTO signal,
            @NotNull List<DeviceDTO> affectedDevices) {
    }

    public record SignalDTO(@NotNull long id, @NotNull BigDecimal value, @NotNull Date creationAt) {
    }

    public record NewEventDTO(@NotNull long eventTypeId, @NotNull List<Long> deviceIds) {
    }

    public record EventTypeDTO(@NotNull long id, @NotNull String name) {
    }

    public record NameFilterDTOs(Optional<String> name) {
    }

    public record EventFiltersDTO(Optional<List<Long>> eventTypeIds,
            @DateTimeFormat(pattern = "dd-MM-yyyy") Optional<LocalDate> startDate,
            @DateTimeFormat(pattern = "dd-MM-yyyy") Optional<LocalDate> endDate, Optional<Boolean> manuallyInserted) {
    }
}
