import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { SignalsService } from '../../generated-sources/openapi';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { AppRoute, isRoute } from './routing/routing.model';
import { filter, take } from 'rxjs/operators';

export interface LabeledRoute {
  label: string;
  path: AppRoute;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  links: LabeledRoute[] = [
    {
      label: 'Home',
      path: AppRoute.HOME,
    },
    {
      label: 'Countries',
      path: AppRoute.COUNTRIES,
    },
    {
      label: 'Devices',
      path: AppRoute.DEVICES,
    },
    {
      label: 'Events',
      path: AppRoute.EVENTS,
    },
  ];

  activeLink: AppRoute = this.links[0].path;

  title = 'signals-processing';

  constructor(
    readonly service: SignalsService,
    readonly client: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the active path from the URL, the first time AppComponent is loaded.
    // We need the active path in order to set which nav tab is currently active.
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), take(1)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const path = event.url.split('/')[1];

        if(isRoute(path)) {
          this.activeLink = path;
        }
      }
    });

    this.service.createSignal({ id: 2 }).subscribe((data) => console.log(data));
  }
}
