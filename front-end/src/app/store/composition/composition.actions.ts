import { createActionGroup, props } from '@ngrx/store';
import {
  BaseDeviceDTO,
  CompositionDTO,
  CompositionDetailsDTO,
  CompositionFiltersDTO,
  DeviceDateStatusDTO,
  DeviceDetailsDTO,
  EditedDeviceDTO,
  NewCompositionDTO,
} from '../../../../generated-sources/openapi';

export const CompositionActions = createActionGroup({
  source: 'Country',
  events: {
    'Get Compositions': (filters: CompositionFiltersDTO = {}) => ({ filters }),
    'Compositions Fetched': props<{ compositions: CompositionDTO[] }>(),
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
    'Create composition': props<{ composition: NewCompositionDTO }>(),
    'Composition created': props<any>(),
  },
});
