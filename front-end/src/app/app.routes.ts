import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent),
  },
  {
    path: '',
    loadChildren: () =>
      import('./start/start.routes').then((mod) => mod.START_ROUTES),
  },
];
