import { createReducer, on } from '@ngrx/store';
import { CountryActions } from './country.actions';
import { CountryState, INITIAL_OFFSET } from '../state';

export const initialState: CountryState = {
  countries: [],
  countriesOffset: INITIAL_OFFSET,
};

export const countryReducer = createReducer(
  initialState,
  on(CountryActions.getCitiesOfCountry, (state, { countryId }) => ({
    ...state,
    currentlyViewedCountryId: countryId,
  })),
  on(CountryActions.getCountries, (state, { offset }) => ({
    ...state,
    countriesOffset: offset,
  })),
  on(CountryActions.countryCreated, (state) => ({
    ...state,
    countries: [],
    countriesOffset: INITIAL_OFFSET,
  })),
  on(CountryActions.countriesFetched, (state, { countries }) => {
    const currentCountries = state.countries.map((country) => country.id);
    const countriesToAdd = countries.filter(
      (c) => !currentCountries.includes(c.id)
    );

    const finalCountries = [...state.countries, ...countriesToAdd];

    return { ...state, countries: finalCountries };
  }),
  on(CountryActions.citiesOfCountryFetched, (state, { cities }) => {
    return { ...state, cities };
  }),
  on(CountryActions.locationsFetched, (state, { locations }) => {
    return { ...state, locations };
  })
);
