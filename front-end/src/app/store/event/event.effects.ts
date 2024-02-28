import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EventsService } from '../../../../generated-sources/openapi';
import { EventActions } from './event.actions';
import { EMPTY, catchError, map, switchMap, withLatestFrom } from 'rxjs';
import { eventFilters } from './event.selectors';

@Injectable()
export class EventEffects {
  loadEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.getEvents, EventActions.eventCreated, EventActions.eventDeleted),
      withLatestFrom(this.store.select(eventFilters)),
      switchMap(([_, filters]) =>
        this.eventsService.readEvents(filters).pipe(
          map((events) => EventActions.eventsFetched({ events })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  loadDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.getEventDetails),
      switchMap(({ id }) =>
        this.eventsService.readEventDetails(id).pipe(
          map((details) => EventActions.eventDetailsFetched({ details })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  createEvent = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.createEvent),
      switchMap(({ event }) =>
        this.eventsService.createEvent(event).pipe(
          map(() => EventActions.eventCreated()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  deleteEvent = createEffect(() =>
  this.actions$.pipe(
    ofType(EventActions.deleteEvent),
    switchMap(({ id }) =>
      this.eventsService.deleteEvent(id).pipe(
        map((details) => EventActions.eventDeleted()),
        catchError(() => EMPTY)
      )
    )
  )
);

  constructor(
    private actions$: Actions,
    private eventsService: EventsService,
    private store: Store
  ) {}
}
