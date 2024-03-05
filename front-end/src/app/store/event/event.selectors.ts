import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EVENT_STATE, EventState } from '../state';

export const feature = createFeatureSelector<EventState>(EVENT_STATE);

export const events = createSelector(feature, (state) => state.events);

export const eventDetails = createSelector(feature, (state) => state.details);

export const eventFilters = createSelector(feature, (state) => state.filters);

export const uploadingSignalsInProgress = createSelector(feature, (state) => state.uploadingSignalsInProgress);
