import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import { locations } from '../../store/country/country.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-city-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ScrollingModule],
  templateUrl: './city-details.component.html',
  styleUrl: './city-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityDetailsComponent {
  locations$ = this.store.select(locations);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('cityId'));

      this.store.dispatch(CountryActions.getLocations({ cityId: id }));
  }
  
  getOperationalLabel(operational: boolean) {
    return operational ? 'Operational' : 'Not operational';
  }

  goToLocationCompositions(cityName: string, locationName: string) {
    this.router.navigate([`/compositions`], { relativeTo: this.route, queryParams: { cityName, locationName } });
  }
}
