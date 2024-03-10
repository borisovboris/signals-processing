package com.signalsprocessing.engine.transfer.compositions;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record DeviceDTO(@NotNull long id, @NotNull String name, @NotNull String code,
        @NotNull StatusDTO status, @NotNull LocalDate creationAt, @NotNull String compositionCode) {
}
