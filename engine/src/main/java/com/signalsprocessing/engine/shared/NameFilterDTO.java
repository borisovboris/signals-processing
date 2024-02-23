package com.signalsprocessing.engine.shared;

import java.util.List;
import java.util.Optional;

import jakarta.annotation.Nullable;

public class NameFilterDTO {
    @Nullable
    String name;

    @Nullable
    List<Long> exludedItemIds;

    public NameFilterDTO(@Nullable String name, @Nullable List<Long> excludedItemIds) {
        this.name = name;
        this.exludedItemIds = excludedItemIds;
    }

    public Optional<String> getName() {
        return Optional.ofNullable(name);
    }

    public void setName(String name) {
        this.name = name;
    }

    public Optional<List<Long>> getExludedItemIds() {
        return Optional.ofNullable(exludedItemIds);
    }

    public void setExludedItemIds(List<Long> exludedItemIds) {
        this.exludedItemIds = exludedItemIds;
    }
}
