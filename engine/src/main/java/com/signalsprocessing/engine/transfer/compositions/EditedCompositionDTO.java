package com.signalsprocessing.engine.transfer.compositions;

import jakarta.validation.constraints.NotNull;

public class EditedCompositionDTO extends BaseCompositionDTO {
    @NotNull
    Long id;

    public EditedCompositionDTO(Long id, String code, Long locationId, Long typeId,
            Long statusId, String coordinates, String description) {
        super(code, locationId, typeId, statusId, coordinates, description);
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
