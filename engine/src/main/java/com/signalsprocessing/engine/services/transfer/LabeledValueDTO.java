package com.signalsprocessing.engine.services.transfer;

import jakarta.validation.constraints.NotNull;

public record LabeledValueDTO(@NotNull Long value, @NotNull String label) {
}
