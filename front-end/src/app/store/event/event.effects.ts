import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EventsService } from '../../../../generated-sources/openapi';
import { EventActions } from './event.actions';
import { EMPTY, catchError, map, switchMap, withLatestFrom } from 'rxjs';
import { eventFilters } from './event.selectors';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class EventEffects {
  loadEvents = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EventActions.getEvents,
        EventActions.eventCreated,
        EventActions.eventDeleted,
        EventActions.signalsUploaded
      ),
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
          map(() => EventActions.eventDeleted()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  uploadSignals = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.uploadSignals),
      switchMap(({ signals }) =>
        this.eventsService.uploadSignals(signals).pipe(
          map(() => {
            this.snackBar.open('Signals uploaded ✔', undefined, {
              duration: 3000,
              panelClass: ['snackbar-accent-color-text'],
            });
            return EventActions.signalsUploaded();
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private eventsService: EventsService,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}
}
