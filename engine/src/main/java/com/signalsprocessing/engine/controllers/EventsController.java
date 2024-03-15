package com.signalsprocessing.engine.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.EventService;
import com.signalsprocessing.engine.shared.NameFilterDTO;
import com.signalsprocessing.engine.transfer.events.EventDTO;
import com.signalsprocessing.engine.transfer.events.EventDetailsDTO;
import com.signalsprocessing.engine.transfer.events.EventFiltersDTO;
import com.signalsprocessing.engine.transfer.events.EventTypeDTO;
import com.signalsprocessing.engine.transfer.events.NewEventDTO;
import com.signalsprocessing.engine.transfer.events.UploadedSignalDTO;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(value = "/api/events/", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "events")
public class EventsController {
    private EventService service;

    public EventsController(EventService service) {
        this.service = service;
    }

    @GetMapping("read-events")
    public List<EventDTO> readEvents(EventFiltersDTO filters) {
        return service.getEvents(filters);
    }

    @GetMapping("read-event-details/{id}")
    public EventDetailsDTO readEventDetails(@PathVariable("id") Long id) {
        return service.getEventDetails(id);
    }

    @GetMapping("event-types")
    public List<EventTypeDTO> readEventTypes(NameFilterDTO filters) {
        return service.getEventTypes(filters);
    }

    @PostMapping("create-event")
    @ResponseBody
    public void createEvent(@RequestBody NewEventDTO event) {
        service.createEvent(event);
    }

    @DeleteMapping("delete-event/{id}")
    @ResponseBody
    public void deleteEvent(@PathVariable("id") Long id) {
        service.deleteEvent(id);
    }

    @PostMapping("upload-signals")
    @ResponseBody
    public void uploadSignals(@RequestBody List<UploadedSignalDTO> signals) {
        service.uploadSignals(signals);
    }
}
