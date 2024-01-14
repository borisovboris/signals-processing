import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state';
import { countries } from '../store/country/country.selectors';
import { CountryActions } from '../store/country/country.actions';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsComponent implements OnInit {
  countries$ = this.store.select(countries);

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(CountryActions.getCountries());
  }
}
