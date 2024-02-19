package com.signalsprocessing.engine.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.CountryService;
import com.signalsprocessing.engine.services.CountryService.CitiesDTO;
import com.signalsprocessing.engine.services.CountryService.CityDTO;
import com.signalsprocessing.engine.services.CountryService.CountryDTO;
import com.signalsprocessing.engine.services.CountryService.LocationDTO;
import com.signalsprocessing.engine.services.CountryService.LocationsDTO;
import com.signalsprocessing.engine.services.CountryService.NewCityDTO;
import com.signalsprocessing.engine.services.CountryService.NewLocationDTO;
import com.signalsprocessing.engine.shared.NameFilterDTO;

import java.util.List;
import java.util.Optional;

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
    @ResponseBody
    public List<CountryDTO> readCountries(@RequestParam(required = false) Optional<Integer> offset) {
        return service.getCountries(offset);
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

    //TODO consider the case when name is an empty string
    // Use RequestParameter or a DTO for filters instead
    @GetMapping("read-cities-like-name/{name}")
    @ResponseBody
    public List<CityDTO> readCitiesLikeName(@PathVariable("name") String name) {
        return service.getCitiesLikeName(name);
    }

    @GetMapping("read-locations")
    @ResponseBody
    public List<LocationDTO> readLocations(Optional<NameFilterDTO> filters) {
        return service.getLocations(filters);
    }

    @GetMapping("read-locations-of-city/{id}")
    @ResponseBody
    public LocationsDTO readLocationsOfCity(@PathVariable("id") Long id) {
        return service.getLocationsOfCity(id);
    }

    @GetMapping("country-exists/{name}")
    @ResponseBody
    public boolean checkIfCountryExists(@PathVariable("name") String name) {
        return service.checkIfCountryExists(name);
    }

    @PostMapping("create-country")
    public void createCountry(@RequestBody String name) {
        service.createCountry(name);
    }

    @GetMapping("city-exists/{countryId}/{name}")
    @ResponseBody
    public boolean checkIfCityExists(@PathVariable("countryId") Long id, @PathVariable("name") String name) {
        return service.checkIfCityExists(id, name);
    }

    @GetMapping("postal-code-exists/{countryId}/{postalCode}")
    @ResponseBody
    public boolean checkIfPostalCodeExists(@PathVariable("countryId") Long id,
            @PathVariable("postalCode") String postalCode) {
        return service.checkIfPostalCodeExists(id, postalCode);
    }

    @GetMapping("location-name-exists/{cityId}/{name}")
    @ResponseBody
    public boolean checkIfLocationNameExists(@PathVariable("cityId") Long id,
            @PathVariable("name") String name) {
        return service.checkIfLocationNameExists(id, name);
    }

    @PostMapping("create-city")
    @ResponseBody
    public void createCity(@RequestBody NewCityDTO newCity) {
        service.createCity(newCity);
    }

    @PostMapping("create-location")
    @ResponseBody
    public void createLocation(@RequestBody NewLocationDTO newLocation) {
        service.createLocation(newLocation);
    }
}
