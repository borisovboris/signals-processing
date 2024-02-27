import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COMPOSITION_STATE, CompositionState } from '../state';

export const feature =
  createFeatureSelector<CompositionState>(COMPOSITION_STATE);

export const compositions = createSelector(
  feature,
  (state) => state.compositions
);

export const details = createSelector(feature, (state) => state.details);

export const currentlyViewedCompositionId = createSelector(
  feature,
  (state) => state.currentlyViewedCompositionId
);

export const compositionFilters = createSelector(
  feature,
  (state) => state.filters
);

export const deviceDetails = createSelector(feature, (state) => state.deviceDetails);
