import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import { locations } from '../../store/country/country.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DialogService } from '../../shared/services/dialog.service';
import { LocationFormComponent } from './location-form/location-form.component';

@Component({
  selector: 'app-city-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ScrollingModule],
  templateUrl: './city-details.component.html',
  styleUrl: './city-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityDetailsComponent {
  locations$ = this.store.select(locations);
  cityId?: number;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.cityId = Number(this.route.snapshot.paramMap.get('cityId'));

    this.store.dispatch(CountryActions.getLocations({ cityId: this.cityId }));
  }

  getOperationalLabel(operational: boolean) {
    return operational ? 'Operational' : 'Not operational';
  }

  goToLocationCompositions(cityName: string, locationName: string) {
    this.router.navigate([`/compositions`], {
      relativeTo: this.route,
      queryParams: { cityName, locationName },
    });
  }

  openLocationForm() {
    if (this.cityId) {
      this.dialogService.open(LocationFormComponent, {
        data: { cityId: this.cityId },
      });
    }
  }
}
