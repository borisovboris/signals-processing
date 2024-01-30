import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EventState } from '../state';

export const feature = createFeatureSelector<EventState>('eventState');

export const events = createSelector(feature, (state) => state.events);
