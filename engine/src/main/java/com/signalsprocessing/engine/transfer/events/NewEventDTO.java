package com.signalsprocessing.engine.transfer.events;

import java.util.List;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotNull;

public record NewEventDTO(@NotNull long eventTypeId, @Nullable Long newDevicesStatusId,
        @NotNull List<Long> deviceIds) {
}
