import { createActionGroup, props } from '@ngrx/store';
import { CountryDTO } from '../../../../generated-sources/openapi';

export const CountryActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Countries': props<any>(),
    'Countries Fetched': props<{ countries: CountryDTO[] }>(),
  },
});
