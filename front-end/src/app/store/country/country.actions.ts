import { createActionGroup, props } from '@ngrx/store';
import { CountryDTO } from '../../../../generated-sources/openapi';

export const CountryActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Countries': props<any>(),
    'Get Countries With Offset': props<any>(),
    'Countries Fetched': props<{ countries: CountryDTO[] }>(),
    'Additional Countries Fetched': props<{ countries: CountryDTO[] }>(),
  },
});
