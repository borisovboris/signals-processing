package com.signalsprocessing.engine.transfer.compositions;

import com.signalsprocessing.engine.models.Composition;

public record LinkedCompositions(Composition firstComposition, Composition secondComposition) {
}
