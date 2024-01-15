import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['id'];

      this.store.dispatch(CountryActions.getCitiesOfCountry({ countryId: id }));
    });
  }
}
