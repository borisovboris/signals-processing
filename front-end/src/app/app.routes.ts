import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LocationsComponent } from './locations/locations.component';
import { DevicesComponent } from './devices/devices.component';
import { EventsComponent } from './events/events.component';
import { AppRoute } from './routing/routing.model';
import { provideState } from '@ngrx/store';
import { countryReducer } from './store/country/country.reducer';

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
