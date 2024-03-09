package com.signalsprocessing.engine.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.AuthService;
import com.signalsprocessing.engine.services.AuthService.UserDTO;

import io.swagger.v3.oas.annotations.tags.Tag;

@RequestMapping(name = "/api/auth/", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "auth")
@RestController
public class AuthController {

    private AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("register-user")
    @ResponseBody
    public void registerUser(@RequestBody UserDTO user) {
        service.registerUser(user);
    }

    @PostMapping(value = "login-user", produces ="text/plain")
    @ResponseBody
    public String loginUser(@RequestBody UserDTO user) {
        return service.loginUser(user);
    }
}
