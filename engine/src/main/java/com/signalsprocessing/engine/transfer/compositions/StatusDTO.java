package com.signalsprocessing.engine.transfer.compositions;

import jakarta.validation.constraints.NotNull;

public record StatusDTO(@NotNull Long id, @NotNull String name, @NotNull boolean isOperational,
        @NotNull boolean isBroken,
        @NotNull boolean inMaintenance) {
}
