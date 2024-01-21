package com.signalsprocessing.engine.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.CompositionService;
import com.signalsprocessing.engine.services.CompositionService.CompositionDTO;
import com.signalsprocessing.engine.services.CompositionService.CompositionDetailsDTO;
import com.signalsprocessing.engine.services.CompositionService.CompositionFiltersDTO;
import com.signalsprocessing.engine.services.CompositionService.NewDeviceDTO;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping(name = "/api/compositions/", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "compositions")
@RestController
public class CompositionsController {

    private CompositionService service;

    public CompositionsController(CompositionService service) {
        this.service = service;
    }

    @GetMapping("read-compositions")
    public List<CompositionDTO> readCompositions(Optional<CompositionFiltersDTO> filters) {
        return service.readCompositions(filters);
    }

    @GetMapping("read-composition-details/{id}")
    public CompositionDetailsDTO readCompositionDetails(@PathVariable long id) {
        return service.getCompositionDetails(id);
    }

    @PostMapping("create-device")
    public void createDevice(@RequestBody NewDeviceDTO newDevice) {
        service.createDevice(newDevice);
    }
}
