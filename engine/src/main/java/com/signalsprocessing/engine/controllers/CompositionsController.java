package com.signalsprocessing.engine.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.CompositionService;
import com.signalsprocessing.engine.services.CompositionService.CompositionDTO;
import com.signalsprocessing.engine.services.CompositionService.CompositionDetailsDTO;
import com.signalsprocessing.engine.services.CompositionService.CompositionFiltersDTO;
import com.signalsprocessing.engine.services.CompositionService.CompositionStatusDTO;
import com.signalsprocessing.engine.services.CompositionService.CompositionTypeDTO;
import com.signalsprocessing.engine.services.CompositionService.DeviceDateStatusDTO;
import com.signalsprocessing.engine.services.CompositionService.LinkedCompositionsDTO;
import com.signalsprocessing.engine.services.CompositionService.NewCompositionDTO;
import com.signalsprocessing.engine.services.CompositionService.NewDeviceDTO;
import com.signalsprocessing.engine.services.CountryService.LocationDTO;
import com.signalsprocessing.engine.shared.NameFilterDTO;

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

    @GetMapping("read-device-status-timeline/{id}")
    public List<DeviceDateStatusDTO> readDeviceStatusTimeline(@PathVariable long id) {
        return service.getDeviceStatusTimeline(id);
    }

    @GetMapping("read-composition-statuses")
    @ResponseBody
    public List<CompositionStatusDTO> readCompositionStatuses(Optional<NameFilterDTO> filters) {
        return service.getCompositionStatuses(filters);
    }

    @GetMapping("read-composition-types")
    @ResponseBody
    public List<CompositionTypeDTO> readCompositionTypes(Optional<NameFilterDTO> filters) {
        return service.getCompositionTypes(filters);
    }

    @GetMapping("composition-exists/{locationId}/{code}")
    @ResponseBody
    public boolean checkIfCompositionExists(@PathVariable("locationId") Long id, @PathVariable("code") String code) {
        return service.checkIfCompositionExists(id, code);
    }

    @PostMapping("create-device")
    public void createDevice(@RequestBody NewDeviceDTO newDevice) {
        service.createDevice(newDevice);
    }

    @PostMapping("create-composition")
    public void createComposition(@RequestBody NewCompositionDTO newComposition) {
        service.createComposition(newComposition);
    }

    @PostMapping("link-compositions")
    public void linkCompositions(@RequestBody LinkedCompositionsDTO link) {
        service.linkCompositions(link);
    }

    @PostMapping("unlink-compositions")
    public void unlinkCompositions(@RequestBody LinkedCompositionsDTO link) {
        service.unlinkCompositions(link);
    }

    @DeleteMapping("delete-device/{id}")
    public void deleteDevice(@PathVariable long id) {
        service.deleteDevice(id);
    }
}
