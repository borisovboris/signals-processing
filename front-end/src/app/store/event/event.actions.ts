import { createActionGroup, props } from '@ngrx/store';
import {
  EventDTO,
  EventDetailsDTO,
} from '../../../../generated-sources/openapi';

export const EventActions = createActionGroup({
  source: 'Event',
  events: {
    'Get Events': props<any>(),
    'Events fetched': props<{ events: EventDTO[] }>(),
    'Get event details': props<{ id: number }>(),
    'Event details fetched': props<{ details: EventDetailsDTO }>(),
  },
});
