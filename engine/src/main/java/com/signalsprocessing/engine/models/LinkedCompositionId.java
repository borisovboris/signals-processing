package com.signalsprocessing.engine.models;

public class LinkedCompositionId {
    private Long firstCompositionId;
    private Long secondCompositionId;

    public LinkedCompositionId(Long firstCompositonId, Long secondCompositionId) {
        this.firstCompositionId = firstCompositonId;
        this.secondCompositionId = secondCompositionId;
    }

    public Long getFirstCompositionId() {
        return firstCompositionId;
    }

    public void setFirstCompositionId(Long firstCompositonId) {
        this.firstCompositionId = firstCompositonId;
    }

    public Long getSecondCompositionId() {
        return secondCompositionId;
    }

    public void setSecondCompositionId(Long secondCompositionId) {
        this.secondCompositionId = secondCompositionId;
    }

}
