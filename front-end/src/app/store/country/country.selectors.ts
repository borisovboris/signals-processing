import { createSelector } from '@ngrx/store';
import { AppState } from '../state';

export const selectFeature = (state: AppState) => state.country;

export const selectFeatureCount = createSelector(
  selectFeature,
  (state) => state.countries
);
