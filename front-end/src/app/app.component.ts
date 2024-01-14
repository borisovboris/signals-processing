import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SignalsService } from '../../generated-sources/openapi';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { ROUTE } from './routing/routing.model';

export interface AppRoute {
  label: string,
  path: ROUTE,
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  links: AppRoute[] = [{
    label: 'Home',
    path: ROUTE.HOME
  },
  {
    label: 'Locations',
    path: ROUTE.LOCATIONS
  },
  {
    label: 'Devices',
    path: ROUTE.DEVICES
  },
  {
    label: 'Events',
    path: ROUTE.EVENTS
  }];

  activeLink = this.links[0].path;

  title = 'signals-processing';

  constructor(readonly service: SignalsService, readonly client: HttpClient) {}

  ngOnInit(): void {
    this.service.createSignal({ id: 2 }).subscribe((data) => console.log(data));
  }
}
