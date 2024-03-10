package com.signalsprocessing.engine.transfer.events;

import java.util.List;

import com.signalsprocessing.engine.transfer.compositions.DeviceDTO;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotNull;

public record EventDetailsDTO(@NotNull EventDTO event, @Nullable SignalDTO signal,
        @NotNull List<DeviceDTO> affectedDevices) {
}
