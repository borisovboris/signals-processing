import { createReducer, on } from '@ngrx/store';
import { EventState } from '../state';
import { EventActions } from './event.actions';

export const initialState: EventState = {
  events: [],
};

export const eventReducer = createReducer(
  initialState,
  on(EventActions.eventsFetched, (state, { events }) => {
    return { ...state, events };
  }),
  on(EventActions.eventDetailsFetched, (state, { details }) => {
    return { ...state, details };
  })
);
