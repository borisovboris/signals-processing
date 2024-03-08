import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../generated-sources/openapi';
import { EMPTY, catchError, map, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
 

  registerUser = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      switchMap(({ user }) =>
        this.authService.registerUser(user).pipe(
          map(() => AuthActions.userRegistered()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}
}
