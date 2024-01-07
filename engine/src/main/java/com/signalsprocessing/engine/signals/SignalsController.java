package com.signalsprocessing.engine.signals;

import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@ComponentScan
@RestController
@Tag(name="signals")
@RequestMapping("api/signals")
public class SignalsController {
    private SignalsService service;


    @GetMapping()
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public SignalDTO getMethodName(HttpServletResponse response) {
        var result = this.service.readSignals();
        return new SignalDTO(1L);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public SignalDTO create(@RequestBody SignalDTO signal) {
        long something = signal.id();
        var random = "";
        return signal;
    }

    public SignalsController(SignalsService service) {
        this.service = service;
    }


    public record SignalDTO(long id) {}
}
