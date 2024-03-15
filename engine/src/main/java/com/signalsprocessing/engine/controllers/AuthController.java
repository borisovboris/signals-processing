package com.signalsprocessing.engine.controllers;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.signalsprocessing.engine.services.AuthService;
import com.signalsprocessing.engine.services.UserService;
import com.signalsprocessing.engine.transfer.user.UserDTO;

import io.swagger.v3.oas.annotations.tags.Tag;

@RequestMapping(value = "/api/auth/", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "auth")
@RestController
public class AuthController {

    private AuthService authService;
    private UserService userService;

    public AuthController(AuthService service, UserService userService) {
        this.authService = service;
        this.userService = userService;
    }

    @PostMapping("register-user")
    @ResponseBody
    public void registerUser(@RequestBody UserDTO user) {
        authService.registerUser(user);
    }

    @PostMapping(value = "login-user", produces = "text/plain")
    @ResponseBody
    public String loginUser(@RequestBody UserDTO user) {
        return authService.loginUser(user);
    }

    @GetMapping("check-username-exists/{name}")
    @ResponseBody
    public boolean checkIfUsernameExists(@PathVariable String name) {
        return userService.checkIfUserExists(name);
    }
}
