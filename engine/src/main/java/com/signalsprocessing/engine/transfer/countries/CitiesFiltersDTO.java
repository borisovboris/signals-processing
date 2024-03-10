package com.signalsprocessing.engine.transfer.countries;

import com.signalsprocessing.engine.shared.OffsetConstraint;

import io.micrometer.common.lang.Nullable;

public class CitiesFiltersDTO extends OffsetConstraint {
    private Long countryId;

    public CitiesFiltersDTO(Long countryId, @Nullable Integer offset) {
        super(offset);
        this.countryId = countryId;
    }

    public Long getCountryId() {
        return countryId;
    }
}