import { createFeatureSelector, createSelector } from '@ngrx/store';
import { COUNTRY_STATE, CountryState } from '../state';

export const feature = createFeatureSelector<CountryState>(COUNTRY_STATE);

export const countries = createSelector(feature, (state) => state.countries);

export const cities = createSelector(feature, (state) => state.cities);

export const locations = createSelector(feature, (state) => state.locations);

export const cityFilters = createSelector(
  feature,
  (state) => state.cityFilters
);

export const countriesOffset = createSelector(
  feature,
  (state) => state.countriesOffset
);

export const currentlyViewedCountry = createSelector(
  feature,
  (state) => state.currentlyViewedCountry
);

export const currentlyViewedCity = createSelector(
  feature,
  (state) => state.currentlyViewedCity
);
