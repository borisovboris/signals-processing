import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CompositionsService } from '../../../../generated-sources/openapi';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, map, switchMap } from 'rxjs';
import { CompositionActions } from './composition.actions';

@Injectable()
export class CompositionEffects {
  loadCompositions = createEffect(() =>
    this.actions$.pipe(
      ofType(CompositionActions.getCompositions),
      switchMap(( { filters }) =>
        this.compositionService.readCompositions(filters).pipe(
          map((compositions) =>
            CompositionActions.compositionsFetched({ compositions })
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
