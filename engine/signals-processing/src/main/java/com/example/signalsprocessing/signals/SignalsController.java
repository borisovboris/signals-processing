package com.example.signalsprocessing.signals;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class SignalsController {
    @GetMapping("signals")

    public String getMethodName() {
        return "<h1>Hello Controller</h1>";
    }

}
