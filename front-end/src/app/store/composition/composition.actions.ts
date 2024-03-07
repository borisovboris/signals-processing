import { createActionGroup, props } from '@ngrx/store';
import {
  BaseCompositionDTO,
  BaseDeviceDTO,
  CompositionDTO,
  CompositionDetailsDTO,
  CompositionFiltersDTO,
  DeviceDetailsDTO,
  EditedCompositionDTO,
  EditedDeviceDTO,
} from '../../../../generated-sources/openapi';

export const CompositionActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Compositions': (filters: CompositionFiltersDTO = {}) => ({ filters }),
    'Compositions Fetched': props<{ compositions: CompositionDTO[] }>(),
    'Get composition': props<{ id: number }>(),
    'Composition fetched': props<{ composition: CompositionDTO }>(),
    'Reset compositions': props<any>(),
    'Get Details': props<{ id: number }>(),
    'Details Fetched': props<{ details: CompositionDetailsDTO }>(),
    'Create device': props<{ device: BaseDeviceDTO }>(),
    'Device created': props<any>(),
    'Edit device': props<{ device: EditedDeviceDTO }>(),
    'Device edited': props<any>(),
    'Link compositions': props<{ firstId: number; secondId: number }>(),
    'Compositions linked': props<any>(),
    'Unlink compositions': props<{ firstId: number; secondId: number }>(),
    'Compositions unlinked': props<any>(),
    'Delete device': props<{ id: number }>(),
    'Device deleted': props<any>(),
    'Get device details': props<{ id: number }>(),
    'Device details fetched': props<{
      deviceDetails: DeviceDetailsDTO;
    }>(),
    'Create composition': props<{ composition: BaseCompositionDTO }>(),
    'Composition created': props<any>(),
    'Edit composition': props<{ composition: EditedCompositionDTO }>(),
    'Composition edited': props<any>(),
    'Delete composition': props<{ id: number }>(),
    'Composition deleted': props<any>(),
  },
});
