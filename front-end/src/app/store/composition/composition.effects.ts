import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CompositionsService } from '../../../../generated-sources/openapi';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, map, switchMap, withLatestFrom } from 'rxjs';
import { CompositionActions } from './composition.actions';
import {
  compositionFilters,
  currentlyViewedCompositionId,
} from './composition.selectors';

@Injectable()
export class CompositionEffects {
  loadCompositions = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CompositionActions.getCompositions,
        CompositionActions.compositionCreated,
        CompositionActions.compositionDeleted,
      ),
      withLatestFrom(this.store.select(compositionFilters)),
      switchMap(([_, filters]) =>
        this.compositionService.readCompositions(filters).pipe(
          map((compositions) =>
            CompositionActions.compositionsFetched({ compositions })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  loadDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CompositionActions.getDetails,
        CompositionActions.deviceCreated,
        CompositionActions.deviceEdited,
        CompositionActions.compositionsLinked,
        CompositionActions.compositionsUnlinked,
        CompositionActions.deleteDevice
      ),
      withLatestFrom(this.store.select(currentlyViewedCompositionId)),
      switchMap(([_, compositionId]) =>
        this.compositionService.readCompositionDetails(compositionId!).pipe(
          map((details) => CompositionActions.detailsFetched({ details })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  createDevice = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.createDevice),
      switchMap(({ device }) =>
        this.compositionService.createDevice(device).pipe(
          map(() => CompositionActions.deviceCreated()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  editDevice = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.editDevice),
      switchMap(({ device }) =>
        this.compositionService.editDevice(device).pipe(
          map(() => CompositionActions.deviceEdited()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  createComposition = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.createComposition),
      switchMap(({ composition }) =>
        this.compositionService.createComposition(composition).pipe(
          map(() => CompositionActions.compositionCreated()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  deleteComposition = createEffect(() =>
  this.actions$.pipe(
    ofType(CompositionActions.deleteComposition),
    switchMap(({ id }) =>
      this.compositionService.deleteComposition(id).pipe(
        map(() => CompositionActions.compositionDeleted()),
        catchError(() => EMPTY)
      )
    )
  )
);

  linkCompositions = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.linkCompositions),
      switchMap(({ firstId, secondId }) =>
        this.compositionService.linkCompositions({ firstId, secondId }).pipe(
          map(() => CompositionActions.compositionsLinked()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  unlinkCompositions = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.unlinkCompositions),
      switchMap(({ firstId, secondId }) =>
        this.compositionService.unlinkCompositions({ firstId, secondId }).pipe(
          map(() => CompositionActions.compositionsUnlinked()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  deleteDevice = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.deleteDevice),
      switchMap(({ id }) =>
        this.compositionService.deleteDevice(id).pipe(
          map(() => CompositionActions.compositionsUnlinked()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getDeviceDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.getDeviceDetails),
      switchMap(({ id }) =>
        this.compositionService.readDeviceDetails(id).pipe(
          map((deviceDetails) =>
            CompositionActions.deviceDetailsFetched({ deviceDetails })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private compositionService: CompositionsService,
    private store: Store
  ) {}
}
