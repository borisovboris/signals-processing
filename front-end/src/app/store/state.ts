import {
  CitiesDTO,
  CompositionDTO,
  CompositionDetailsDTO,
  CountryDTO,
  LocationsDTO,
} from '../../../generated-sources/openapi';

export interface CountryState {
  countries: CountryDTO[];
  cities?: CitiesDTO;
  locations?: LocationsDTO;
}

export interface CompositionState {
  compositions?: CompositionDTO[];
  details?: CompositionDetailsDTO;
}

export interface AppState {
  country: CountryState;
}
