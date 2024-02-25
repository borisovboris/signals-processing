import { createReducer, on } from '@ngrx/store';
import { EventState } from '../state';
import { EventActions } from './event.actions';

export const initialState: EventState = {
  events: [],
  filters: {},
};

export const eventReducer = createReducer(
  initialState,
  on(EventActions.eventDetailsFetched, (state, { details }) => {
    return { ...state, details };
  }),
  on(EventActions.resetEvents, EventActions.eventCreated, (state) => ({
    ...state,
    events: [],
    filters: { ...state.filters, offset: 0 },
  })),
  on(EventActions.getEvents, (state, { filters }) => ({ ...state, filters })),
  on(EventActions.eventsFetched, (state, { events }) => ({
    ...state,
    events: [...state.events.slice(), ...events],
  }))
);
