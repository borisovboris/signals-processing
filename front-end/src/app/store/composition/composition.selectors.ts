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

export const timeline = createSelector(feature, (state) => state.timeline);
