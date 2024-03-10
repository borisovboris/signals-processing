package com.signalsprocessing.engine.transfer.compositions;

import java.util.List;

import jakarta.validation.constraints.NotNull;

public record CompositionDetailsDTO(
        @NotNull List<CompositionDTO> relatedCompositions,
        @NotNull List<DeviceDTO> devices) {
}
