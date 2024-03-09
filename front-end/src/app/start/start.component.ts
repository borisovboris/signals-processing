import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { AppRoute, isRoute, routePaths } from '../routing/routing.model';
import { filter } from 'rxjs/operators';
import { TokenService } from '../auth/token.service';

export interface LabeledRoute {
  label: string;
  path: AppRoute;
}

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule, RouterLink],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
  links: LabeledRoute[] = [
    {
      label: 'Countries',
      path: AppRoute.COUNTRIES,
    },
    {
      label: 'Compositions',
      path: AppRoute.COMPOSITIONS,
    },
    {
      label: 'Events',
      path: AppRoute.EVENTS,
    },
  ];

  activeLink: AppRoute = this.links[0].path;

  title = 'signals-processing';

  constructor(
    private router: Router,
    private readonly tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const currentPath = this.getPathFromUrl(this.router.url);

    if (isRoute(currentPath)) {
      this.activeLink = currentPath;
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const path = this.getPathFromUrl(event.url);

          if (isRoute(path)) {
            // We need the active path in order to set which material nav tab is currently active.
            this.activeLink = path;
          }
        }
      });
  }

  getPathFromUrl(url: string): string | undefined {
    for (const path of routePaths) {
      if (url.includes(path)) {
        return path;
      }
    }

    return undefined;
  }

  logOut() {
    this.tokenService.deleteAuthToken();
    this.router.navigateByUrl('/login');
  }
}
