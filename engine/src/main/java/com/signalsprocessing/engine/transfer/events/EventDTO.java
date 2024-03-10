package com.signalsprocessing.engine.transfer.events;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;

public record EventDTO(@NotNull long id, @NotNull String typeName,
        @NotNull boolean manualInsert, @NotNull LocalDate eventCreationAt) {
}
