import { Routes } from '@angular/router';
import { AppRoute } from './routing/routing.model';

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
    path: AppRoute.COUNTRIES,
    loadChildren: () =>
      import('./countries/routes').then((mod) => mod.COUNTRIES_ROUTES),
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
