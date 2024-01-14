package com.signalsprocessing.engine.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.CountryService;
import com.signalsprocessing.engine.services.CountryService.CountryDTO;

import java.util.List;

import org.springframework.http.MediaType;

import io.swagger.v3.oas.annotations.tags.Tag;

@RequestMapping(name = "/api/countries/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "countries")
@RestController
public class CountriesController {

    private CountryService service;

    public CountriesController(CountryService service) {
        this.service = service;
    }

    @GetMapping("read-countries")
    public List<CountryDTO> readCountries() {
        return service.getCountries();
    }
}
