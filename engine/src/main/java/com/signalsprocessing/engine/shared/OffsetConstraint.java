package com.signalsprocessing.engine.shared;

import java.util.Optional;

import jakarta.annotation.Nullable;

public abstract class OffsetConstraint {
    @Nullable
    private Integer offset;

    public OffsetConstraint(@Nullable Integer offset) {
        this.offset = offset;
    }

    public Optional<Integer> getOffset() {
        return Optional.ofNullable(offset);
    }
}
