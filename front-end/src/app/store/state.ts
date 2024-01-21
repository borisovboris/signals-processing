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
  currentlyViewedCompositionId?: number;
}

export interface AppState {
  country: CountryState;
}
