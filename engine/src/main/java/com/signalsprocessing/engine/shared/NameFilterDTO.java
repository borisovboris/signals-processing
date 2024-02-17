package com.signalsprocessing.engine.shared;

import jakarta.annotation.Nullable;

public class NameFilterDTO {
    @Nullable
    String name;

    public NameFilterDTO(@Nullable String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
