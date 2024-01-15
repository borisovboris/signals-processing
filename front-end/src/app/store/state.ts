import { CitiesDTO, CityDTO, CountryDTO } from '../../../generated-sources/openapi';

export interface CountryState {
  countries: CountryDTO[];
  cities?: CitiesDTO,
}

export interface AppState {
  country: CountryState;
}
