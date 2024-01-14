import { Routes } from '@angular/router';
import { AppRoute } from './routing/routing.model';
import { provideState } from '@ngrx/store';
import { countryReducer } from './store/country/country.reducer';
import { provideEffects } from '@ngrx/effects';
import { CountryEffects } from './store/country/country.effects';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoute.HOME,
  },
  {
    path: AppRoute.HOME,
    loadComponent: () =>
      import('./home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: AppRoute.LOCATIONS,
    loadComponent: () =>
      import('./locations/locations.component').then(
        (mod) => mod.LocationsComponent
      ),
    providers: [
      provideState({ name: 'countryState', reducer: countryReducer }),
      provideEffects([CountryEffects]),
    ],
  },
  {
    path: AppRoute.DEVICES,
    loadComponent: () =>
      import('./devices/devices.component').then((mod) => mod.DevicesComponent),
  },
  {
    path: AppRoute.EVENTS,
    loadComponent: () =>
      import('./events/events.component').then((mod) => mod.EventsComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
