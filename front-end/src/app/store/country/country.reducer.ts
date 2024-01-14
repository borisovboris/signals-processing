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
  }))
);
