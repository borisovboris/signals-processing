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
import { AppRoute, isRoute, routePaths } from './routing/routing.model';
import { filter } from 'rxjs/operators';

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
export class AppComponent {
 
}
