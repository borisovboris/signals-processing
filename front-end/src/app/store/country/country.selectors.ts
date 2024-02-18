import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COUNTRY_STATE, CountryState } from '../state';

export const feature = createFeatureSelector<CountryState>(COUNTRY_STATE);

export const countries = createSelector(feature, (state) => state.countries);

export const cities = createSelector(feature, (state) => state.cities);

export const locations = createSelector(feature, (state) => state.locations);

export const currentlyViewedCountryId = createSelector(feature, (state) => state.currentlyViewedCountryId);

export const countriesOffset = createSelector(feature, (state) => state.countriesOffset);
