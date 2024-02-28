import { createReducer, on } from '@ngrx/store';
import { CompositionState } from '../state';
import { CompositionActions } from './composition.actions';
import { routerNavigationAction } from '@ngrx/router-store';

export const compositionsPath = /^\/compositions$/;

export const initialState: CompositionState = {
  compositions: [],
  filters: {},
};

export const compositionReducer = createReducer(
  initialState,
  on(CompositionActions.getCompositions, (state, { filters }) => ({
    ...state,
    filters,
  })),
  on(CompositionActions.compositionsFetched, (state, { compositions }) => {
    return {
      ...state,
      compositions: [...(state.compositions ?? []), ...compositions],
    };
  }),
  on(
    CompositionActions.resetCompositions,
    CompositionActions.compositionCreated,
    CompositionActions.compositionDeleted,
    (state) => ({
      ...state,
      compositions: [],
    })
  ),
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
  on(CompositionActions.getDeviceDetails, (state) => {
    return {
      ...state,
      deviceDetails: undefined,
    };
  }),
  on(CompositionActions.deviceDetailsFetched, (state, { deviceDetails }) => {
    return {
      ...state,
      deviceDetails,
    };
  }),
  on(routerNavigationAction, (state, { payload }) => {
    return resetDataOnPageVisit(state, payload.event.url);
  })
);

function resetDataOnPageVisit(
  state: CompositionState,
  url: string
): CompositionState {
  if (compositionsPath.test(url)) {
    return { ...state, compositions: [] };
  }

  return state;
}
