package com.signalsprocessing.engine.transfer.countries;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record LocationDTO(@NotNull long id, @NotNull String code, @NotNull String name, @NotNull String address,
        String coordinates, String description, @NotNull LocalDate creationAt,
        @NotNull boolean isOperational, @NotNull int compositionsSize) {
}
