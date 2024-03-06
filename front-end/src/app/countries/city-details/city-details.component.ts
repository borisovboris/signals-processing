import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import { currentlyViewedCity, locations } from '../../store/country/country.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DialogService } from '../../shared/services/dialog.service';
import {
  LocationDialogData,
  LocationFormComponent,
} from './location-form/location-form.component';
import { ListActionsComponent } from '../../shared/list-actions/list-actions.component';
import { CityDTO, LocationDTO } from '../../../../generated-sources/openapi';
import { fadeIn } from '../../shared/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs';
import { NoDataComponent } from '../../shared/no-data/no-data.component';

@Component({
  selector: 'app-city-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ScrollingModule,
    ListActionsComponent,
    NoDataComponent,
  ],
  animations: [fadeIn],
  templateUrl: './city-details.component.html',
  styleUrl: './city-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityDetailsComponent {
  private readonly destroyedRef = inject(DestroyRef);
  locations?: LocationDTO[];
  currentCity?: CityDTO;
  cityId?: number;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cityId = Number(this.route.snapshot.paramMap.get('cityId'));

    this.store.dispatch(CountryActions.getLocations({ cityId: this.cityId }));
    this.store.dispatch(CountryActions.getCity({ id: this.cityId }));

    this.store
      .select(locations)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe((locations) => {
        this.locations = locations;
        this.changeRef.markForCheck();
      });

      this.store.select(currentlyViewedCity).pipe(filter(city => city !== undefined), take(1)).subscribe((city) => {
        this.currentCity = city;
        this.changeRef.markForCheck();
      });
  }

  goToLocationCompositions(
    locationId: number,
    locationName: string
  ) {
    if(this.currentCity) {
      const cityId = this.currentCity.id;
      const cityName = this.currentCity.name;

      this.router.navigate([`/compositions`], {
        relativeTo: this.route,
        queryParams: { cityId, cityName, locationId, locationName },
      });
    }

  }

  openLocationCreationForm() {
    if (this.cityId) {
      this.dialogService.open(LocationFormComponent, {
        data: { cityId: this.cityId },
      });
    }
  }

  openLocationEditForm(location: LocationDTO) {
    if (this.cityId) {
      const data: LocationDialogData = {
        cityId: this.cityId,
        editInfo: {
          id: location.id,
          name: location.name,
          address: location.address,
          coordinates: location.coordinates,
          description: location.description,
          isOperational: location.isOperational,
        },
      };

      this.dialogService.open(LocationFormComponent, {
        data,
      });
    }
  }

  deleteLocation(id: number) {
    if (this.cityId) {
      this.store.dispatch(
        CountryActions.deleteLocation({ id, cityId: this.cityId })
      );
    }
  }
}
