import { CountryDTO } from '../../../generated-sources/openapi';

export interface CountryState {
  countries: CountryDTO[];
}

export interface AppState {
  country: CountryState;
}
