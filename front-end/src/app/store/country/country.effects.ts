import { Injectable } from '@angular/core';
import { CountriesService } from '../../../../generated-sources/openapi';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CountryActions } from './country.actions';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class CountryEffects {
  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.getCountries),
      exhaustMap(() =>
        this.countriesService.readCountries().pipe(
          map((countries) => CountryActions.countriesFetched({ countries })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private countriesService: CountriesService
  ) {}
}
