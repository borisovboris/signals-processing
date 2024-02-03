import {
  CitiesDTO,
  CompositionDTO,
  CompositionDetailsDTO,
  CountryDTO,
  EventDTO,
  EventDetailsDTO,
  LocationsDTO,
} from '../../../generated-sources/openapi';

export const EVENT_STATE = "eventState";
export const COUNTRY_STATE = "countryState";
export const COMPOSITION_STATE = "compositionState";

export interface CountryState {
  countries: CountryDTO[];
  cities?: CitiesDTO;
  locations?: LocationsDTO;
}

export interface CompositionState {
  compositions?: CompositionDTO[];
  details?: CompositionDetailsDTO;
  currentlyViewedCompositionId?: number;
}

export interface EventState {
  events: EventDTO[];
  details?: EventDetailsDTO;
}

export interface AppState {
  country: CountryState;
}
