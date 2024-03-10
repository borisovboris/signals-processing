package com.signalsprocessing.engine.shared;

import jakarta.validation.constraints.NotNull;

public record LabeledValueDTO(@NotNull Long value, @NotNull String label) {
}
