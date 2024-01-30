package com.signalsprocessing.engine.controllers;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.EventService;
import com.signalsprocessing.engine.services.EventService.EventDTO;

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

}
