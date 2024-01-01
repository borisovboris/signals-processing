package com.signalsprocessing.engine.signals;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.GetMapping;

@ComponentScan
@RestController
public class SignalsController {
    private SignalsService service;

    @GetMapping("signals")

    public String getMethodName() {
        return this.service.readSignals();
    }

    public SignalsController(SignalsService service) {
        this.service = service;
    }

}
