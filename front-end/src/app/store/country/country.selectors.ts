import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CountryState } from '../state';

export const feature = createFeatureSelector<CountryState>('countryState');

export const countries = createSelector(feature, (state) => state.countries);

export const cities = createSelector(feature, (state) => state.cities);
