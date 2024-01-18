import { createActionGroup, props } from '@ngrx/store';
import { CompositionDTO } from '../../../../generated-sources/openapi';

export const CompositionActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Compositions': props<any>(),
    'Compositions Fetched': props<{ compositions: CompositionDTO[] }>(),
  },
});
