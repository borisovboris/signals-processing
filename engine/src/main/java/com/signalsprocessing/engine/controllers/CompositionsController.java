package com.signalsprocessing.engine.controllers;

import java.util.List;

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
import com.signalsprocessing.engine.services.CompositionService.DeviceDTO;
import com.signalsprocessing.engine.services.CompositionService.DeviceDetailsDTO;
import com.signalsprocessing.engine.services.CompositionService.LinkedCompositionsDTO;
import com.signalsprocessing.engine.services.transfer.BaseCompositionDTO;
import com.signalsprocessing.engine.services.transfer.BaseDeviceDTO;
import com.signalsprocessing.engine.services.transfer.CompositionFiltersDTO;
import com.signalsprocessing.engine.services.transfer.EditedCompositionDTO;
import com.signalsprocessing.engine.services.transfer.EditedDeviceDTO;
import com.signalsprocessing.engine.services.transfer.LabeledValueDTO;
import com.signalsprocessing.engine.shared.NameFilterDTO;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    public List<CompositionDTO> readCompositions(CompositionFiltersDTO filters) {
        return service.readCompositions(filters);
    }

    @GetMapping("read-composition/{id}")
    public CompositionDTO readComposition(@PathVariable long id) {
        return service.getComposition(id);
    }

    @GetMapping("read-composition-details/{id}")
    public CompositionDetailsDTO readCompositionDetails(@PathVariable long id) {
        return service.getCompositionDetails(id);
    }

    @GetMapping("read-device-details/{id}")
    public DeviceDetailsDTO readDeviceDetails(@PathVariable long id) {
        return service.getDeviceDetails(id);
    }

    @GetMapping("read-composition-statuses")
    @ResponseBody
    public List<LabeledValueDTO> readCompositionStatuses(NameFilterDTO filters) {
        return service.getCompositionStatuses(filters);
    }

    @GetMapping("read-composition-types")
    @ResponseBody
    public List<LabeledValueDTO> readCompositionTypes(NameFilterDTO filters) {
        return service.getCompositionTypes(filters);
    }

    @GetMapping("composition-exists/{locationId}/{code}")
    @ResponseBody
    public boolean checkIfCompositionExists(@PathVariable("locationId") Long id, @PathVariable("code") String code) {
        return service.checkIfCompositionExists(id, code);
    }

    @GetMapping("device-name-exists/{compositionId}/{name}")
    @ResponseBody
    public boolean checkIfDeviceNameExists(@PathVariable("compositionId") Long id, @PathVariable("name") String name) {
        return service.checkIfDeviceNameExists(id, name);
    }

    @GetMapping("device-code-exists/{compositionId}/{code}")
    @ResponseBody
    public boolean checkIfDeviceCodeExists(@PathVariable("compositionId") Long id, @PathVariable("code") String code) {
        return service.checkIfDeviceCodeExists(id, code);
    }

    @GetMapping("read-device-statuses")
    @ResponseBody
    public List<LabeledValueDTO> readDeviceStatuses(NameFilterDTO filters) {
        return service.getDeviceStatuses(filters);
    }

    @GetMapping("read-devices")
    @ResponseBody
    public List<DeviceDTO> readDevices(NameFilterDTO filters) {
        return service.getDevices(filters);
    }

    @PostMapping("create-device")
    public void createDevice(@RequestBody BaseDeviceDTO newDevice) {
        service.createDevice(newDevice);
    }

    @PutMapping("edit-device")
    public void editDevice(@RequestBody EditedDeviceDTO editedDevice) {
        service.editDevice(editedDevice);
    }

    @PostMapping("create-composition")
    public void createComposition(@RequestBody BaseCompositionDTO newComposition) {
        service.createComposition(newComposition);
    }

    @PutMapping("edit-composition")
    public void editComposition(@RequestBody EditedCompositionDTO editedComposition) {
        service.editComposition(editedComposition);
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

    @DeleteMapping("delete-composition/{id}")
    public void deleteComposition(@PathVariable long id) {
        service.deleteComposition(id);
    }
}
