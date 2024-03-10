package com.signalsprocessing.engine.transfer.user;

import jakarta.validation.constraints.NotNull;

public record UserDTO(@NotNull String username, @NotNull String password) {
}