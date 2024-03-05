import { createReducer, on } from '@ngrx/store';
import { EventState } from '../state';
import { EventActions } from './event.actions';

export const initialState: EventState = {
  events: [],
  filters: {},
  uploadingSignalsInProgress: false,
};

export const eventReducer = createReducer(
  initialState,
  on(EventActions.eventDetailsFetched, (state, { details }) => {
    return { ...state, details };
  }),
  on(EventActions.resetEvents, EventActions.eventCreated, EventActions.eventDeleted, (state) => ({
    ...state,
    events: [],
    filters: { ...state.filters, offset: 0 },
  })),
  on(EventActions.getEvents, (state, { filters }) => ({ ...state, filters })),
  on(EventActions.eventsFetched, (state, { events }) => ({
    ...state,
    events: [...state.events.slice(), ...events],
  })),
  on(EventActions.uploadSignals, (state) => ({ ...state, uploadingSignalsInProgress: true })),
  on(EventActions.signalsUploaded, (state) => ({ ...state, uploadingSignalsInProgress: false })),
);
