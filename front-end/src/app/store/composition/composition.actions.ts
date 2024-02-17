import { createActionGroup, props } from '@ngrx/store';
import {
  CompositionDTO,
  CompositionDetailsDTO,
  CompositionFiltersDTO,
  DeviceDateStatusDTO,
  NewCompositionDTO,
  NewDeviceDTO,
} from '../../../../generated-sources/openapi';

export const CompositionActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Compositions': props<{ filters?: CompositionFiltersDTO }>(),
    'Compositions Fetched': props<{ compositions: CompositionDTO[] }>(),
    'Get Details': props<{ id: number }>(),
    'Details Fetched': props<{ details: CompositionDetailsDTO }>(),
    'Create device': props<{ device: NewDeviceDTO }>(),
    'Device created': props<any>(),
    'Link compositions': props<{ firstId: number; secondId: number }>(),
    'Compositions linked': props<any>(),
    'Unlink compositions': props<{ firstId: number; secondId: number }>(),
    'Compositions unlinked': props<any>(),
    'Delete device': props<{ id: number }>(),
    'Device deleted': props<any>(),
    'Get device status timeline': props<{ id: number }>(),
    'Device status timeline fetched': props<{
      timeline: DeviceDateStatusDTO[];
    }>(),
    'Create composition': props<{ composition: NewCompositionDTO }>(),
    'Composition created': props<any>(),
  },
});
