import { createReducer, on } from '@ngrx/store';
import { CompositionState } from '../state';
import { CompositionActions } from './composition.actions';

export const initialState: CompositionState = {
  compositions: [],
};

export const compositionReducer = createReducer(
  initialState,
  on(CompositionActions.compositionsFetched, (state, { compositions }) => {
    return {
      ...state,
      compositions,
    };
  }),
  on(CompositionActions.getDetails, (state, { id }) => {
    return {
      ...state,
      currentlyViewedCompositionId: id,
    };
  }),
  on(CompositionActions.detailsFetched, (state, { details }) => {
    return {
      ...state,
      details,
    };
  }),
  on( CompositionActions.getDeviceStatusTimeline, (state) => {
    return {
      ...state,
      timeline: undefined,
    };
  }),
  on( CompositionActions.deviceStatusTimelineFetched, (state, { timeline }) => {
    return {
      ...state,
      timeline,
    };
  })
);
