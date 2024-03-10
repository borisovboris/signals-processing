package com.signalsprocessing.engine.transfer.compositions;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record DeviceDateStatusDTO(@NotNull Long occurrences, @NotNull LocalDate date) {
}