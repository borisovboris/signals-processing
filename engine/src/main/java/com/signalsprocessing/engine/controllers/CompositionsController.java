package com.signalsprocessing.engine.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.CompositionService;
import com.signalsprocessing.engine.services.CompositionService.CompositionDTO;
import com.signalsprocessing.engine.services.CompositionService.CompositionFiltersDTO;

import io.swagger.v3.oas.annotations.tags.Tag;

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
}
