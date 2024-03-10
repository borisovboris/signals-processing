package com.signalsprocessing.engine.transfer.countries;

import jakarta.validation.constraints.NotNull;

public record CountryDTO(@NotNull long id, @NotNull String name) {
}
