import { createReducer, on } from '@ngrx/store';
import { CountryActions } from './country.actions';
import { CountryState } from '../state';

export const initialState: CountryState = {
  countries: [],
};

export const countryReducer = createReducer(
  initialState,
  on(CountryActions.countriesFetched, (state, { countries }) => ({
    ...state,
    countries,
  })),
  on(CountryActions.additionalCountriesFetched, (state, { countries }) => {
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
);
