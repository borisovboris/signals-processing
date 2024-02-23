import {
  ApplicationConfig,
  LOCALE_ID,
  Provider,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(MatNativeDateModule),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideStore({}),
    provideEffects(),
    provideStoreDevtools(),
  ],
};
