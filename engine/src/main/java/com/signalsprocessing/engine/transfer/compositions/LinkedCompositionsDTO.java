package com.signalsprocessing.engine.transfer.compositions;

import jakarta.validation.constraints.NotNull;

public record LinkedCompositionsDTO(@NotNull long firstId, @NotNull long secondId) {
}
