import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LocationsComponent } from './locations/locations.component';
import { DevicesComponent } from './devices/devices.component';
import { EventsComponent } from './events/events.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'locations',
    component: LocationsComponent,
  },
  {
    path: 'devices',
    component: DevicesComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
