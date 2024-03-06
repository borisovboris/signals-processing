import { createReducer, on } from '@ngrx/store';
import { CountryActions } from './country.actions';
import { CountryState, INITIAL_OFFSET } from '../state';
import { routerNavigationAction } from '@ngrx/router-store';

export const initialState: CountryState = {
  countries: [],
  countriesOffset: INITIAL_OFFSET,
  cityFilters: {},
};

export const countriesPath = /^\/countries$/;
export const citiesPath = /^\/countries\/[\d]+$/;
export const locationsPath = /^\/countries\/cities\/[\d]+$/;

export const countryReducer = createReducer(
  initialState,
  on(
    CountryActions.cityCreated,
    CountryActions.cityDeleted,
    CountryActions.cityEdited,
    (state) => ({
      ...state,
      cityFilters: { ...state.cityFilters, offset: 0 },
      cities: undefined,
    })
  ),
  on(CountryActions.getCitiesOfCountry, (state, { filters }) => ({
    ...state,
    cityFilters: filters,
  })),
  on(CountryActions.getCountries, (state, { offset }) => ({
    ...state,
    countriesOffset: offset,
  })),
  on(
    CountryActions.countryCreated,
    CountryActions.countryDeleted,
    CountryActions.countryEdited,
    (state) => ({
      ...state,
      countries: [],
      countriesOffset: INITIAL_OFFSET,
    })
  ),
  on(CountryActions.countriesFetched, (state, { countries }) => {
    const finalCountries = [...state.countries, ...countries];

    return { ...state, countries: finalCountries };
  }),
  on(CountryActions.citiesOfCountryFetched, (state, { cities }) => {
    const currentCities = state.cities ?? [];
    const finalCities = [...currentCities, ...cities];

    return { ...state, cities: finalCities };
  }),
  on(CountryActions.locationsFetched, (state, { locations }) => {
    return { ...state, locations };
  }),
  on(CountryActions.countryFetched, (state, { country }) => {
    return { ...state, currentlyViewedCountry: country }
  }),
  on(CountryActions.cityFetched, (state, { city }) => {
    return { ...state, currentlyViewedCity: city }
  }),
  on(routerNavigationAction, (state, { payload }) => {
    return resetDataOnPageVisit(state, payload.event.url);
  })
);

// When we visit the page, we clean up the data, because the new one
// is going to be fetched
function resetDataOnPageVisit(state: CountryState, url: string): CountryState {
  if (countriesPath.test(url)) {
    return { ...state, countries: [], currentlyViewedCity: undefined };
  }

  if (citiesPath.test(url)) {
    return { ...state, cities: undefined, currentlyViewedCountry: undefined };
  }

  if(locationsPath.test(url)) {
    return { ...state, currentlyViewedCity: undefined };
  }

  return state;
}
