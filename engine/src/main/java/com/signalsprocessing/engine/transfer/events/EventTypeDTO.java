package com.signalsprocessing.engine.transfer.events;

import jakarta.validation.constraints.NotNull;

public record EventTypeDTO(@NotNull long id, @NotNull String name) {
}
