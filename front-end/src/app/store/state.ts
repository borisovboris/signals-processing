import {
  CitiesDTO,
  CompositionDTO,
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
}

export interface AppState {
  country: CountryState;
}
