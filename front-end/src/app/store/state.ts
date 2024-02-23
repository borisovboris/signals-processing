import {
  CitiesDTO,
  CompositionDTO,
  CompositionDetailsDTO,
  CountryDTO,
  DeviceDateStatusDTO,
  EventDTO,
  EventDetailsDTO,
  EventFiltersDTO,
  LocationsDTO,
} from '../../../generated-sources/openapi';

export const INITIAL_OFFSET = 0;

export const EVENT_STATE = 'eventState';
export const COUNTRY_STATE = 'countryState';
export const COMPOSITION_STATE = 'compositionState';

export interface CountryState {
  currentlyViewedCountryId?: number;
  countries: CountryDTO[];
  cities?: CitiesDTO;
  locations?: LocationsDTO;
  countriesOffset: number;
}

export interface CompositionState {
  compositions?: CompositionDTO[];
  details?: CompositionDetailsDTO;
  currentlyViewedCompositionId?: number;
  timeline?: DeviceDateStatusDTO[];
}

export interface EventState {
  events: EventDTO[];
  details?: EventDetailsDTO;
  filters: EventFiltersDTO;
}

export interface AppState {
  country: CountryState;
}
