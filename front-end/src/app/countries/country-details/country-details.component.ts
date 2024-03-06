import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import {
  cities,
  currentlyViewedCountry,
} from '../../store/country/country.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { DialogService } from '../../shared/services/dialog.service';
import { CityFormComponent } from './city-form/city-form.component';
import { BatchList } from '../../shared/batch-list';
import { debounceTime, filter, take } from 'rxjs';
import { ListActionsComponent } from '../../shared/list-actions/list-actions.component';
import { CityDTO, CountryDTO } from '../../../../generated-sources/openapi';
import { DialogReference } from '../../shared/services/dialog-reference';
import { NoDataComponent } from '../../shared/no-data/no-data.component';
import { fadeIn, fadeOut } from '../../shared/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ScrollingModule,
    ListActionsComponent,
    NoDataComponent,
  ],
  animations: [fadeIn, fadeOut],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailsComponent extends BatchList implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  private readonly destroyedRef = inject(DestroyRef);

  cities?: CityDTO[];
  currentCountry?: CountryDTO;
  countryId?: number;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly changeRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.countryId = Number(this.route.snapshot.paramMap.get('countryId'));
    this.scrolled$
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyedRef))
      .subscribe(() => this.getOffset());

    this.store.dispatch(
      CountryActions.getCitiesOfCountry({
        countryId: this.countryId,
        offset: 0,
      })
    );

    if (this.countryId) {
      this.store.dispatch(CountryActions.getCountry({ id: this.countryId }));
    }

    this.store
      .select(currentlyViewedCountry)
      .pipe(
        filter((data) => data !== undefined),
        take(1)
      )
      .subscribe((country) => {
        this.currentCountry = country;
        this.changeRef.markForCheck();
      });

    this.store
      .select(cities)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe((cities) => {
        this.cities = cities;
        this.changeRef.markForCheck();
      });
  }

  getNewBatch() {
    this.store.dispatch(
      CountryActions.getCitiesOfCountry({
        countryId: this.countryId,
        offset: this.offset,
      })
    );
  }

  goToCity(id: number) {
    this.router.navigate([`/countries/cities`, id]);
  }

  openCityEditForm(city: CityDTO) {
    if (this.countryId !== undefined) {
      const dialogRef = this.dialogService.open(CityFormComponent, {
        data: {
          countryId: this.countryId,
          cityId: city.id,
          name: city.name,
          postalCode: city.postalCode,
        },
      });

      this.onDialogClosed(dialogRef);
    }
  }

  openCityCreationForm() {
    if (this.countryId !== undefined) {
      const dialogRef = this.dialogService.open(CityFormComponent, {
        data: { countryId: this.countryId },
      });

      this.onDialogClosed(dialogRef);
    }
  }

  deleteCity(id: number) {
    this.store.dispatch(CountryActions.deleteCity({ id }));
    this.offset = 0;
  }

  onDialogClosed(ref: DialogReference) {
    ref
      .afterClosed()
      .pipe(
        take(1),
        filter((completed) => completed === true)
      )
      .subscribe((_) => (this.offset = 0));
  }
}
