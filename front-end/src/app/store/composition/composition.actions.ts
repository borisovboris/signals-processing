import { createActionGroup, props } from '@ngrx/store';
import { CompositionDTO, CompositionDetailsDTO, CompositionFiltersDTO } from '../../../../generated-sources/openapi';

export const CompositionActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Compositions': props<{ filters?: CompositionFiltersDTO }>(),
    'Compositions Fetched': props<{ compositions: CompositionDTO[] }>(),
    'Get Details': props<{ id: number }>(),
    'Details Fetched': props<{ details: CompositionDetailsDTO }>(),
  },
});
