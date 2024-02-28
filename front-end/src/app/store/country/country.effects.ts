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
import { cityFilters, countriesOffset } from './country.selectors';
import { Store } from '@ngrx/store';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class CountryEffects {
  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CountryActions.getCountries,
        CountryActions.countryCreated,
        CountryActions.countryDeleted,
        CountryActions.countryEdited
      ),
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
      ofType(
        CountryActions.getCitiesOfCountry,
        CountryActions.cityCreated,
        CountryActions.cityDeleted
      ),
      withLatestFrom(this.store.select(cityFilters)),
      switchMap(([, filters]) => {
        return this.countriesService.readCitiesOfCountry(filters).pipe(
          map((cities) => CountryActions.citiesOfCountryFetched({ cities })),
          catchError(() => EMPTY)
        );
      })
    )
  );

  loadLocations = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CountryActions.getLocations,
        CountryActions.locationCreated,
        CountryActions.locationDeleted
      ),
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

  deleteCountry = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.deleteCountry),
      switchMap(({ id }) =>
        this.countriesService.deleteCountry(id).pipe(
          map(() => CountryActions.countryDeleted()),
          catchError(() => EMPTY)
        )
      )
    )
  );

  editCountry = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.editCountry),
      switchMap(({ country }) =>
        this.countriesService.editCountry(country).pipe(
          map(() => CountryActions.countryEdited()),
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

  deleteCity = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.deleteCity),
      switchMap(({ id }) =>
        this.countriesService.deleteCity(id).pipe(
          map(() => CountryActions.cityDeleted()),
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

  deleteLocation = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryActions.deleteLocation),
      switchMap(({ id, cityId }) =>
        this.countriesService.deleteLocation(id).pipe(
          map(() => CountryActions.locationDeleted({ cityId })),
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
