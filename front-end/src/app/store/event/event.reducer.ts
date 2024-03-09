import { createReducer, on } from '@ngrx/store';
import { EventState } from '../state';
import { EventActions } from './event.actions';
import { routerNavigationAction } from '@ngrx/router-store';

export const initialState: EventState = {
  events: [],
  filters: {},
  uploadingSignalsInProgress: false,
};

export const eventDetailsPath = /^\/events\/[\d]+$/;

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
  on(routerNavigationAction, (state, { payload }) => {
    return resetDataOnPageVisit(state, payload.event.url);
  })
);

function resetDataOnPageVisit(state: EventState, url: string): EventState {
  if (eventDetailsPath.test(url)) {
    return { ...state, details: undefined };
  }

  return state;
}
