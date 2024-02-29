import { createActionGroup, props } from '@ngrx/store';
import {
  BaseCityDTO,
  CitiesDTO,
  CitiesFiltersDTO,
  CountryDTO,
  EditedCityDTO,
  LocationsDTO,
  NewLocationDTO,
} from '../../../../generated-sources/openapi';
import { INITIAL_OFFSET } from '../state';

export const CountryActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Countries': (offset: number = INITIAL_OFFSET) => ({ offset }),
    'Countries Fetched': props<{ countries: CountryDTO[] }>(),
    'Get Cities Of Country': (filters: CitiesFiltersDTO = {}) => ({ filters }),
    'Cities Of Country Fetched': props<{ cities: CitiesDTO }>(),
    'Get Locations': props<{ cityId: number }>(),
    'Locations Fetched': props<{ locations: LocationsDTO }>(),
    'Create country': props<{ name: string }>(),
    'Country created': props<any>(),
    'Create city': props<{ city: BaseCityDTO }>(),
    'City created': props<any>(),
    'Create location': props<{ location: NewLocationDTO }>(),
    'Location created': props<{ cityId: number }>(),
    'Delete country': props<{ id: number }>(),
    'Country deleted': props<any>(),
    'Delete city': props<{ id: number }>(),
    'City deleted': props<any>(),
    'Delete location': props<{ id: number, cityId: number }>(),
    'Location deleted': props<{ cityId: number }>(),
    'Edit country': props<{ country: CountryDTO }>(),
    'Country edited': props<any>(),
    'Edit city': props<{ city: EditedCityDTO }>(),
    'City edited': props<any>(),
  },
});
