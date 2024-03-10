package com.signalsprocessing.engine.transfer.compositions;

import com.signalsprocessing.engine.shared.LabeledValueDTO;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

public record CompositionDTO(@NotNull long id, @NotNull LabeledValueDTO location,
        @NotNull LabeledValueDTO type,
        @NotNull LabeledValueDTO city,
        @NotNull String code,
        @NotNull int devicesSize,
        @NotNull StatusDTO status,
        @Nullable String coordinates,
        @Nullable String description) {
}
