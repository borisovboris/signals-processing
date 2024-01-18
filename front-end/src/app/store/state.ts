import { CitiesDTO, CityDTO, CountryDTO, LocationsDTO } from '../../../generated-sources/openapi';

export interface CountryState {
  countries: CountryDTO[];
  cities?: CitiesDTO,
  locations?: LocationsDTO,
}

export interface AppState {
  country: CountryState;
}
