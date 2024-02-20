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
} from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { countries, countriesOffset, currentlyViewedCountryId } from './country.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class CountryEffects {
  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.getCountries, CountryActions.countryCreated),
      withLatestFrom(this.store.select(countriesOffset)),
      exhaustMap(([_, offset]) =>
        this.countriesService.readCountries(offset).pipe(
          map((countries) => CountryActions.countriesFetched({ countries })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  loadCities = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.getCitiesOfCountry, CountryActions.cityCreated),
      withLatestFrom(this.store.select(currentlyViewedCountryId)),
      switchMap(([, countryId]) => {
        return this.countriesService.readCitiesOfCountry(countryId!).pipe(
          map((cities) => CountryActions.citiesOfCountryFetched({ cities })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  loadLocations = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.getLocations, CountryActions.locationCreated),
      switchMap(({ cityId }) =>
        this.countriesService.readLocationsOfCity(cityId).pipe(
          map((locations) => CountryActions.locationsFetched({ locations })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  createCountry = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.createCountry),
      switchMap(({ name }) =>
        this.countriesService.createCountry(name).pipe(
          map(() => CountryActions.countryCreated()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  createCity = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.createCity),
      switchMap(({ city }) =>
        this.countriesService.createCity(city).pipe(
          map(() => CountryActions.cityCreated()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  createLocation = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.createLocation),
      switchMap(({ location }) =>
        this.countriesService.createLocation(location).pipe(
          map(() =>
            CountryActions.locationCreated({ cityId: location.cityId })
          ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private countriesService: CountriesService,
    private store: Store
  ) {}
}
