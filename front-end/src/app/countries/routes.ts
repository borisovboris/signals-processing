import { Route } from '@angular/router';
import { AppRoute } from '../routing/routing.model';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryDetailsComponent } from './country-details/country-details.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { countryReducer } from '../store/country/country.reducer';
import { CountryEffects } from '../store/country/country.effects';
import { CountriesComponent } from './countries.component';
import { CityDetailsComponent } from './city-details/city-details.component';
import { COUNTRY_STATE } from '../store/state';

export const COUNTRIES_ROUTES: Route[] = [
  {
    path: '',
    component: CountriesComponent,
    providers: [
      provideState({ name: COUNTRY_STATE, reducer: countryReducer }),
      provideEffects([CountryEffects]),
    ],
    children: [
      { path: '', component: CountryListComponent },
      { path: 'details', component: CountryDetailsComponent },
      { path: 'city', component: CityDetailsComponent },
    ],
  },
];
