package com.signalsprocessing.engine.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.format.annotation.DateTimeFormat;

import com.signalsprocessing.engine.shared.OffsetConstraint;

import jakarta.annotation.Nullable;

public class EventFiltersDTO extends OffsetConstraint {
    @Nullable
    private List<Long> eventTypeIds;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Nullable
    private LocalDate startDate;

    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @Nullable
    private LocalDate endDate;

    @Nullable
    private Boolean manuallyInserted;

    public EventFiltersDTO(@Nullable List<Long> eventTypeIds, @Nullable LocalDate startDate,
            @Nullable LocalDate endDate, @Nullable Boolean manuallyInserted, @Nullable Integer offset) {
        super(offset);
        this.eventTypeIds = eventTypeIds;
        this.startDate = startDate;
        this.endDate = endDate;
        this.manuallyInserted = manuallyInserted;
    };

    public Optional<List<Long>> getEventTypeIds() {
        return Optional.ofNullable(eventTypeIds);
    }

    public Optional<LocalDate> getStartDate() {
        return Optional.ofNullable(startDate);
    }

    public Optional<LocalDate> getEndDate() {
        return Optional.ofNullable(endDate);
    }

    public Optional<Boolean> getManuallyInserted() {
        return Optional.ofNullable(manuallyInserted);
    }
}
