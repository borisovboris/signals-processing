import { createActionGroup, props } from '@ngrx/store';
import { CitiesDTO, CountryDTO, LocationsDTO, NewCityDTO } from '../../../../generated-sources/openapi';

export const CountryActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Countries': props<any>(),
    'Countries Fetched': props<{ countries: CountryDTO[] }>(),
    'Get Countries With Offset': props<any>(),
    'Additional Countries Fetched': props<{ countries: CountryDTO[] }>(),
    'Get Cities Of Country': props<{ countryId: number }>(),
    'Cities Of Country Fetched': props<{ cities: CitiesDTO }>(),
    'Get Locations': props<{ cityId: number }>(),
    'Locations Fetched': props<{ locations: LocationsDTO }>(),
    'Create country': props<{ name: string }>(),
    'Country created': props<any>(),
    'Create city': props<{ city: NewCityDTO }>(),
    'City created': props<any>(),
  },
});
