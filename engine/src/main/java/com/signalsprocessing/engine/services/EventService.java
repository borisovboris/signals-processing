package com.signalsprocessing.engine.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.signalsprocessing.engine.models.Device;
import com.signalsprocessing.engine.models.DeviceStatus;
import com.signalsprocessing.engine.models.Event;
import com.signalsprocessing.engine.models.EventDevice;
import com.signalsprocessing.engine.models.EventDeviceId;
import com.signalsprocessing.engine.models.EventType;
import com.signalsprocessing.engine.models.Signal;
import com.signalsprocessing.engine.shared.FilterUtility;
import com.signalsprocessing.engine.shared.NameFilterDTO;
import com.signalsprocessing.engine.transfer.compositions.DeviceDTO;
import com.signalsprocessing.engine.transfer.events.EventDTO;
import com.signalsprocessing.engine.transfer.events.EventDetailsDTO;
import com.signalsprocessing.engine.transfer.events.EventFiltersDTO;
import com.signalsprocessing.engine.transfer.events.EventTypeDTO;
import com.signalsprocessing.engine.transfer.events.NewEventDTO;
import com.signalsprocessing.engine.transfer.events.OriginDTO;
import com.signalsprocessing.engine.transfer.events.OriginDevicesDTO;
import com.signalsprocessing.engine.transfer.events.SignalDTO;
import com.signalsprocessing.engine.transfer.events.UploadedEventDTO;
import com.signalsprocessing.engine.transfer.events.UploadedSignalDTO;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;

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

        if (filters.getEventTypeIds().isPresent()) {
            var eventTypeId = root.get("type").get("id");
            Predicate eventTypeInIds = eventTypeId.in(filters.getEventTypeIds().get());
            predicates.add(eventTypeInIds);
        }

        if (filters.getDeviceIds().isPresent()) {
            var deviceIds = root.get("devices").get("device").get("id");
            Predicate deviceInIds = deviceIds.in(filters.getDeviceIds().get());
            predicates.add(deviceInIds);
        }

        if (filters.getStartDate().isPresent()) {
            var eventCreationDate = root.get("eventCreationAt").as(java.time.LocalDate.class);
            Predicate eventAfterDate = cb.greaterThanOrEqualTo(eventCreationDate,
                    cb.literal(filters.getStartDate().get()));
            predicates.add(eventAfterDate);
        }

        if (filters.getEndDate().isPresent()) {
            var eventCreationDate = root.get("eventCreationAt").as(java.time.LocalDate.class);
            Predicate eventBeforeDate = cb.lessThanOrEqualTo(eventCreationDate, cb.literal(filters.getEndDate().get()));
            predicates.add(eventBeforeDate);
        }

        if (filters.getManuallyInserted().isPresent()) {
            var eventInsertion = root.get("manualInsert").as(Boolean.class);
            Predicate isManualInsert = cb.equal(eventInsertion, cb.literal(filters.getManuallyInserted().get()));
            predicates.add(isManualInsert);
        }

        Predicate finalCriteria = cb.and(predicates.toArray(new Predicate[0]));
        initialQuery.where(finalCriteria);

        Integer offset = FilterUtility.getOffset(filters.getOffset());

        TypedQuery<Event> query = entityManager.createQuery(initialQuery)
                .setFirstResult(offset)
                .setMaxResults(LIMIT);
        List<EventDTO> events = query.getResultList().stream().map(e -> mapEvent(e)).toList();

        return events;
    }

    public EventType getEventTypeByName(String name) {
        TypedQuery<EventType> eventQuery = entityManager
                .createQuery("SELECT et FROM EventType et WHERE et.name = :name", EventType.class)
                .setParameter("name", name);

        return eventQuery.getSingleResult();
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

    public List<EventTypeDTO> getEventTypes(NameFilterDTO filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<EventType> criteriaQuery = cb.createQuery(EventType.class);
        Root<EventType> root = criteriaQuery.from(EventType.class);
        CriteriaQuery<EventType> initialQuery = criteriaQuery.select(root);

        Predicate[] filterPredicates = FilterUtility.getFilterPredicates(filters, cb, root);
        Predicate finalCriteria = cb.and(filterPredicates);
        initialQuery.where(finalCriteria);

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
    public void uploadSignals(List<UploadedSignalDTO> uploadedSignals) {
        for (UploadedSignalDTO uploadedSignal : uploadedSignals) {
            Device sourceDevice = getDevice(uploadedSignal.getSourceDevice().getName(),
                    uploadedSignal.getSourceDevice().getOrigin());

            Signal signal = new Signal();
            signal.setDevice(sourceDevice);
            signal.setDescription(uploadedSignal.getDescription());
            signal.setValue(uploadedSignal.getValue());
            entityManager.persist(signal);

            for (UploadedEventDTO event : uploadedSignal.getEvents()) {
                generateEvent(event, signal);
            }
        }
    }

    @Transactional
    public void generateEvent(UploadedEventDTO uploadedEvent, Signal signal) {
        for (OriginDevicesDTO devicesFromOrigin : uploadedEvent.getAffectedDevices()) {

            List<String> deviceNames = devicesFromOrigin.getNames();
            EventType eventType = getEventTypeByName(uploadedEvent.getName());

            Event event = new Event();
            event.setType(eventType);
            event.setManualInsert(false);
            event.setSignal(signal);

            DeviceStatus newDeviceStatus = null;

            if (uploadedEvent.getNewDevicesStatusName().isPresent()) {
                newDeviceStatus = getDeviceStatusByName(
                        uploadedEvent.getNewDevicesStatusName().get());
            }

            for (String deviceName : deviceNames) {
                Device device = getDevice(deviceName, devicesFromOrigin.getOrigin());

                if (newDeviceStatus != null) {
                    device.setStatus(newDeviceStatus);
                }

                EventDevice eventDevice = new EventDevice();
                EventDeviceId id = new EventDeviceId(event.id, device.id);
                eventDevice.setId(id);
                eventDevice.setDevice(device);
                eventDevice.setEvent(event);

                entityManager.persist(eventDevice);
            }
        }

    }

    public DeviceStatus getDeviceStatusByName(String name) {
        TypedQuery<DeviceStatus> eventQuery = entityManager
                .createQuery("SELECT ds FROM DeviceStatus ds WHERE ds.name = :name", DeviceStatus.class)
                .setParameter("name", name);

        return eventQuery.getSingleResult();
    }

    @Transactional
    public Device getDevice(String deviceName, OriginDTO origin) {
        TypedQuery<Device> query = entityManager
                .createQuery(
                        "SELECT d from Device d WHERE d.name = :deviceName " +
                                "AND d.composition.code = :compositionCode " +
                                "AND d.composition.location.name = :locationName " +
                                "AND d.composition.location.city.name = :cityName " +
                                "AND d.composition.location.city.country.name = :countryName",
                        Device.class)
                .setParameter("deviceName", deviceName)
                .setParameter("compositionCode", origin.getComposition())
                .setParameter("locationName", origin.getLocation())
                .setParameter("cityName", origin.getCity())
                .setParameter("countryName", origin.getCountry());

        return query.getSingleResult();
    }

    @Transactional
    public void createEvent(NewEventDTO newEvent) {
        EventType type = entityManager.getReference(EventType.class, newEvent.eventTypeId());

        TypedQuery<Device> query = entityManager
                .createQuery("SELECT d FROM Device d WHERE d.id in :deviceIds", Device.class)
                .setParameter("deviceIds", newEvent.deviceIds());
        List<Device> devices = query.getResultList();

        DeviceStatus newDeviceStatus = null;

        if (newEvent.newDevicesStatusId() != null) {
            newDeviceStatus = entityManager.getReference(DeviceStatus.class, newEvent.newDevicesStatusId());
        }

        Event event = new Event();
        event.setType(type);
        event.setManualInsert(true);

        for (Device device : devices) {
            if (newDeviceStatus != null) {
                device.setStatus(newDeviceStatus);
            }

            EventDevice eventDevice = new EventDevice();
            EventDeviceId id = new EventDeviceId(event.id, device.id);
            eventDevice.setId(id);
            eventDevice.setDevice(device);
            eventDevice.setEvent(event);

            entityManager.persist(eventDevice);
        }
    }

    @Transactional
    public void deleteEvent(Long id) {
        entityManager.remove(entityManager.getReference(Event.class, id));
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
}
