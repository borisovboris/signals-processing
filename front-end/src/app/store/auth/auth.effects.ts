import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../generated-sources/openapi';
import { EMPTY, catchError, map, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthActions } from './auth.actions';
import { TokenService } from '../../auth/token.service';

@Injectable()
export class AuthEffects {
  loginUser = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginUser),
      switchMap(({ user }) =>
        this.authService.loginUser(user).pipe(
          map((token) => {
            this.tokenService.setAuthToken(token);
            return AuthActions.userLogged({ token });
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

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

  something() {
    return of('hhh');
  }

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private tokenService: TokenService,
    private store: Store,
    private snackBar: MatSnackBar
  ) {}
}
