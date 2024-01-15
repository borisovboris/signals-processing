import { Injectable } from '@angular/core';
import { CountriesService } from '../../../../generated-sources/openapi';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CountryActions } from './country.actions';
import {
  map,
  exhaustMap,
  catchError,
  withLatestFrom,
  switchMap,
  tap,
} from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { countries } from './country.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class CountryEffects {
  loadCountries$ = createEffect(() =>
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

  loadCountriesWithOffset = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.getCountriesWithOffset),
      withLatestFrom(this.store.select(countries)),
      switchMap(([_, countries]) =>
        this.countriesService
          .readCountriesWithOffset(countries[countries.length - 1].id!)
          .pipe(
            map((countries) =>
              CountryActions.additionalCountriesFetched({ countries })
            ),
            catchError(() => EMPTY)
          )
      )
    )
  );

  loadCities = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CountryActions.getCitiesOfCountry),
        switchMap(({ countryId }) =>
          this.countriesService
            .readCities(countryId)
            .pipe(
              catchError(() => EMPTY)
            )
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private countriesService: CountriesService,
    private store: Store
  ) {}
}
