import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../../generated-sources/openapi';
import { EMPTY, catchError, map, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthActions } from './auth.actions';
import { TokenService } from '../../auth/token.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  loginUser = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginUser),
      switchMap(({ user }) =>
        this.authService.loginUser(user).pipe(
          map((token) => {
            this.tokenService.setAuthToken(token);
            this.router.navigateByUrl('/countries');
            return AuthActions.userLogged({ token });
          }),
          catchError(() => {
            this.snackbarService.open('Wrong password or username', {
              duration: 5000,
              panelClasses: ['snackbar-warn-color-text'],
            });
            return EMPTY;
          })
        )
      ),
    )
  );

  registerUser = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerUser),
      switchMap(({ user }) =>
        this.authService.registerUser(user).pipe(
          map(() => {
            this.router.navigateByUrl('/login');
            this.snackbarService.open('User created');
            return AuthActions.userRegistered();
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private tokenService: TokenService,
    private store: Store,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}
}
