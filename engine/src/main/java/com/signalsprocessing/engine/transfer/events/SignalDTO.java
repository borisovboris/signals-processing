package com.signalsprocessing.engine.transfer.events;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record SignalDTO(@NotNull long id, @NotNull BigDecimal value, @NotNull LocalDate creationAt) {
}
