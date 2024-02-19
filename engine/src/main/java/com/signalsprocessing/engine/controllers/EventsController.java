package com.signalsprocessing.engine.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.CountryService.NewCityDTO;
import com.signalsprocessing.engine.services.EventService;
import com.signalsprocessing.engine.services.EventService.EventDTO;
import com.signalsprocessing.engine.services.EventService.EventDetailsDTO;
import com.signalsprocessing.engine.services.EventService.NewEventDTO;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(name = "/api/events/", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "events")
public class EventsController {
    private EventService service;

    public EventsController(EventService service) {
        this.service = service;
    }

    @GetMapping("read-events")
    public List<EventDTO> readEvents() {
        return service.getEvents();
    }

    @GetMapping("read-event-details/{id}")
    public EventDetailsDTO readEventDetails(@PathVariable("id") Long id) {
        return service.getEventDetails(id);
    }

    @PostMapping("create-event")
    @ResponseBody
    public void createEvent(@RequestBody NewEventDTO event) {
        service.createEvent(event);
    }
}