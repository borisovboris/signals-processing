import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, CountryState } from '../state';

export const feature = createFeatureSelector<CountryState>('countryState');

export const countries = createSelector(feature, (state) => state.countries);
