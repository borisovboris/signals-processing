package com.signalsprocessing.engine.transfer.countries;

import jakarta.validation.constraints.NotNull;

public record CityDTO(@NotNull long id, @NotNull String name, @NotNull String postalCode) {
}
