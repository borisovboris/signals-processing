import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';
import { compositions } from '../../store/composition/composition.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteChipsComponent } from '../../shared/autocomplete-chips/autocomplete-chips.component';
import { isDefined } from '../../shared/utils';
import {
  BehaviorSubject,
  map,
  take,
} from 'rxjs';
import { DialogService } from '../../shared/services/dialog.service';
import { CompositionFormComponent } from './composition-form/composition-form.component';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CountriesService } from '../../../../generated-sources/openapi';

@Component({
  selector: 'app-compositions-list',
  standalone: true,
  imports: [
    AutocompleteChipsComponent,
    CommonModule,
    MaterialModule,
    ScrollingModule,
  ],
  templateUrl: './compositions-list.component.html',
  styleUrl: './compositions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionsListComponent implements AfterViewInit {
  citiesCtrl = new FormControl<string[]>([], { nonNullable: true });
  cityCtrl = new FormControl<string>('', { nonNullable: true });
  cities$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  cityOptions$ = this.cities$.asObservable();

  locationsCtrl = new FormControl<string[]>([], { nonNullable: true });
  locationCtrl = new FormControl<string>('', { nonNullable: true });
  locations$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  locationOptions$ = this.locations$.asObservable();

  compositions$ = this.store.select(compositions);
  cityNames: string[] = [];
  locationNames: string[] = [];

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly service: CountriesService
  ) {}

  ngOnInit(): void {}

  getOperationalLabel(operational: boolean) {
    return operational ? 'Operational' : 'Not operational';
  }

  handleCityInput(text: string) {
    this.service
      .readCitiesLikeName(text)
      .pipe(
        take(1),
        map((cities) => cities.map((city) => city.name))
      )
      .subscribe((data) => this.cities$.next(data));
  }

  handleLocationInput(text: string) {
    this.service
      .readLocations({ name: text })
      .pipe(
        take(1),
        map((locations) => locations.map((locations) => locations.name))
      )
      .subscribe((data) => this.locations$.next(data));
  }

  handleCityChipsChange() {
      this.cities$.next([]);
      this.getCompositions(this.getCityChips(), this.getLocationChips());
  }

  handleLocationChipsChange() {
      this.locations$.next([]);
      this.getCompositions(this.getCityChips(), this.getLocationChips());
  }

  setInitialCityAndCountryName(cityName: string, locationName: string) {
    this.citiesCtrl.setValue([cityName]);
    this.locationsCtrl.setValue([locationName]);
  }

  ngAfterViewInit() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const cityName = params['cityName'];
      const locationName = params['locationName'];

      if (isDefined(cityName) && isDefined(locationName)) {
        this.setInitialCityAndCountryName(cityName, locationName);

        this.getCompositions([cityName], [locationName]);

        return;
      }

      this.store.dispatch(CompositionActions.getCompositions({}));
    });
  }

  getCityChips() {
    return this.citiesCtrl.value;
  }

  getLocationChips() {
    return this.locationsCtrl.value;
  }

  getCompositions(cities: string[], locations: string[]) {
    this.store.dispatch(
      CompositionActions.getCompositions({
        filters: {
          cityNames: cities,
          locationNames: locations,
        },
      })
    );
  }

  goToDetails(id: number) {
    this.router.navigate([`compositions`, id]);
  }

  openCountryForm() {
    this.dialogService.open(CompositionFormComponent);
  }
}
