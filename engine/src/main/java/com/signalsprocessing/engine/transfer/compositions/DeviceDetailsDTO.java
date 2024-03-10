package com.signalsprocessing.engine.transfer.compositions;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record DeviceDetailsDTO(@NotNull DeviceDTO device, @NotNull CompositionDTO composition,
        @NotNull List<DeviceDateStatusDTO> timeline) {

}
