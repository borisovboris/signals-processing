package com.signalsprocessing.engine.signals;

import org.springframework.http.MediaType;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

@RequestMapping(name = "/api/signals/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "signals")
@RestController

public class SignalsController {
    public record SignalDTO(long id) {
    }

    private SignalsService service;

    public SignalsController(SignalsService service) {
        this.service = service;
    }

    @GetMapping("read-signals")
    public SignalDTO readSignals() {
        return new SignalDTO(1L);
    }

    @PostMapping("create-signal")
    @ResponseBody
    public SignalDTO createSignal(@RequestBody SignalDTO signal) {
        return signal;
    }
}
