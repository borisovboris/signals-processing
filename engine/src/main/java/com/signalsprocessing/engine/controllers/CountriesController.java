package com.signalsprocessing.engine.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.CountryService;
import com.signalsprocessing.engine.services.CountryService.CitiesDTO;
import com.signalsprocessing.engine.services.CountryService.CityDTO;
import com.signalsprocessing.engine.services.CountryService.CountryDTO;

import java.util.List;

import org.springframework.http.MediaType;

import io.swagger.v3.oas.annotations.tags.Tag;

@RequestMapping(name = "/api/countries/", produces = MediaType.APPLICATION_JSON_VALUE)
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

    @GetMapping("read-countries-with-offset/{id}")
    @ResponseBody
    public List<CountryDTO> readCountriesWithOffset(@PathVariable("id") Long id) {
        return service.getCountriesWithOffset(id);
    }

    @GetMapping("read-cities/{id}")
    @ResponseBody
    public CitiesDTO readCities(@PathVariable("id") Long id) {
        return service.getCitiesOfCountry(id);
    }
}
