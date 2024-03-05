import {
  CitiesDTO,
  CitiesFiltersDTO,
  CompositionDTO,
  CompositionDetailsDTO,
  CompositionFiltersDTO,
  CountryDTO,
  DeviceDetailsDTO,
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
  countries: CountryDTO[];
  cities?: CitiesDTO;
  locations?: LocationsDTO;
  countriesOffset: number;
  cityFilters: CitiesFiltersDTO;
}

export interface CompositionState {
  compositions?: CompositionDTO[];
  details?: CompositionDetailsDTO;
  currentlyViewedCompositionId?: number;
  deviceDetails?: DeviceDetailsDTO;
  filters: CompositionFiltersDTO;
}

export interface EventState {
  events: EventDTO[];
  details?: EventDetailsDTO;
  filters: EventFiltersDTO;
  uploadingSignalsInProgress: boolean;
}

export interface AppState {
  country: CountryState;
}
