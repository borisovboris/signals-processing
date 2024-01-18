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

export const COUNTRIES_ROUTES: Route[] = [
  {
    path: '',
    component: CountriesComponent,
    providers: [
      provideState({ name: 'countryState', reducer: countryReducer }),
      provideEffects([CountryEffects]),
    ],
    children: [
      { path: '', component: CountryListComponent },
      { path: 'details', component: CountryDetailsComponent },
      { path: 'city', component: CityDetailsComponent },
    ],
  },
];
