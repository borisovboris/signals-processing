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
    path: AppRoute.COMPOSITIONS,
    loadChildren: () =>
      import('./compositions/routes').then((mod) => mod.COMPOSITIONS_ROUTES),
  },
  {
    path: AppRoute.EVENTS,
    loadChildren: () =>
      import('./events/routes').then((mod) => mod.EVENT_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
