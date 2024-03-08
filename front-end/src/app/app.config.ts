import {
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MatNativeDateModule } from '@angular/material/core';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { AuthEffects } from './store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MatNativeDateModule),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideEffects([AuthEffects]),
    provideStoreDevtools(),
  ],
};
