import { createActionGroup, props } from '@ngrx/store';
import {
  EventDTO,
  EventDetailsDTO,
  EventFiltersDTO,
  NewEventDTO,
} from '../../../../generated-sources/openapi';

export const EventActions = createActionGroup({
  source: 'Event',
  events: {
    'Get Events': (filters: EventFiltersDTO = {}) => ({ filters }),
    'Events fetched': props<{ events: EventDTO[] }>(),
    'Reset events': props<any>(),
    'Get event details': props<{ id: number }>(),
    'Event details fetched': props<{ details: EventDetailsDTO }>(),
    'Create event': props<{ event: NewEventDTO }>(),
    'Event created': props<any>(),
    'Delete event': props<{ id: number }>(),
    'Event deleted': props<any>(),
  },
});
