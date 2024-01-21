import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompositionState } from '../state';

export const feature =
  createFeatureSelector<CompositionState>('compositionState');

export const compositions = createSelector(
  feature,
  (state) => state.compositions
);

export const details = createSelector(feature, (state) => state.details);

export const currentlyViewedCompositionId = createSelector(
  feature,
  (state) => state.currentlyViewedCompositionId
);
