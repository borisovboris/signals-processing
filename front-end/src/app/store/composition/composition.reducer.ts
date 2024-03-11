import { createReducer, on } from '@ngrx/store';
import { CompositionState } from '../state';
import { CompositionActions } from './composition.actions';
import { routerNavigationAction } from '@ngrx/router-store';

export const compositionsPath = /^\/compositions$/;
export const compositionDetailsPath = /^\/compositions\/[\d]+$/;

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
    CompositionActions.compositionEdited,
    (state) => ({
      ...state,
      compositions: [],
      filters: { ...state.filters, offset: 0 },
    })
  ),
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
  on(CompositionActions.compositionFetched, (state, { composition }) => {
    return { ...state, currentlyViewedComposition: composition };
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

  if (compositionDetailsPath.test(url)) {
    return {
      ...state,
      currentlyViewedCompositionId: extractCompositionId(url),
      currentlyViewedComposition: undefined,
      details: undefined,
    };
  }

  return state;
}

function extractCompositionId(url: string) {
  const brokenDown = url.split('/');
  return Number(brokenDown[brokenDown.length - 1]);
}
