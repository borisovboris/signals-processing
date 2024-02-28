import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';
import { compositions } from '../../store/composition/composition.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteChipsComponent } from '../../shared/autocomplete-chips/autocomplete-chips.component';
import { BehaviorSubject, debounceTime, map, take } from 'rxjs';
import { DialogService } from '../../shared/services/dialog.service';
import { CompositionFormComponent } from './composition-form/composition-form.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CountriesService } from '../../../../generated-sources/openapi';
import { LabeledValue } from '../../shared/autocomplete-chips/autocomplete.model';
import { fadeIn } from '../../shared/animations';
import { BatchList } from '../../shared/batch-list';
import { ListActionsComponent } from '../../shared/list-actions/list-actions.component';

@Component({
  selector: 'app-compositions-list',
  standalone: true,
  imports: [
    AutocompleteChipsComponent,
    CommonModule,
    MaterialModule,
    ScrollingModule,
    ReactiveFormsModule,
    ListActionsComponent
  ],
  animations: [fadeIn],
  templateUrl: './compositions-list.component.html',
  styleUrl: './compositions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionsListComponent extends BatchList implements AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;
  
  @ViewChild('cityChips') cityChips!: AutocompleteChipsComponent;
  @ViewChild('locationChips') locationChips!: AutocompleteChipsComponent;

  citiesCtrl = new FormControl<string[]>([], { nonNullable: true });
  cityCtrl = new FormControl<string>('', { nonNullable: true });
  cities$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  cityOptions$ = this.cities$.asObservable();

  locationsCtrl = new FormControl<string[]>([], { nonNullable: true });
  locationCtrl = new FormControl<string>('', { nonNullable: true });
  locations$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  locationOptions$ = this.locations$.asObservable();

  compositions$ = this.store.select(compositions);
  cityNames: string[] = [];
  locationNames: string[] = [];

  sidepanelForm = new FormGroup({
    citiesCtrl: this.citiesCtrl,
    cityCtrl: this.cityCtrl,
    locationsCtrl: this.locationCtrl,
    locationCtr: this.locationCtrl,
  });

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly service: CountriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.scrolled$.pipe(debounceTime(300)).subscribe(() => this.getOffset());
  }

  handleCityInput(text: string) {
    this.service
      .readCitiesLikeName({
        name: text,
        exludedItemIds: this.getSelectedCities(),
      })
      .pipe(
        take(1),
        map((cities) =>
          cities.map((city) => ({ label: city.name, value: city.id }))
        )
      )
      .subscribe((data) => this.cities$.next(data));
  }

  handleLocationInput(text: string) {
    this.service
      .readLocations({
        name: text,
        exludedItemIds: this.getSelectedLocations(),
      })
      .pipe(
        take(1),
        map((locations) =>
          locations.map((location) => ({
            label: location.name,
            value: location.id,
          }))
        )
      )
      .subscribe((data) => this.locations$.next(data));
  }

  handleCityChipsChange() {
    this.resetCompositions();
    this.getCompositions(this.getSelectedCities(), this.getSelectedLocations());
  }

  handleLocationChipsChange() {
    this.resetCompositions();
    this.getCompositions(this.getSelectedCities(), this.getSelectedLocations());
  }

  resetCompositions() {
    this.offset = 0;
    this.store.dispatch(CompositionActions.resetCompositions());
  }

  setInitialCityAndCountryName(
    cityId: string,
    cityName: string,
    locationId: string,
    locationName: string
  ) {
    this.citiesCtrl.setValue([cityId]);
    this.locationsCtrl.setValue([locationId]);

    this.cityChips.setChips([{ label: cityName, value: Number(cityId) }]);
    this.locationChips.setChips([
      { label: locationName, value: Number(locationId) },
    ]);
  }

  ngAfterViewInit() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const cityId = params['cityId'] as string | undefined;
      const cityName = params['cityName'] as string | undefined;
      const locationId = params['locationId'] as string | undefined;
      const locationName = params['locationName'] as string | undefined;

      if (cityId && cityName && locationId && locationName) {
        this.setInitialCityAndCountryName(
          cityId,
          cityName,
          locationId,
          locationName
        );

        this.getCompositions([Number(cityId)], [Number(locationId)]);

        return;
      }

      this.store.dispatch(CompositionActions.getCompositions());
    });
  }

  getSelectedCities() {
    return this.citiesCtrl.value.map((v) => Number(v));
  }

  getSelectedLocations() {
    return this.locationsCtrl.value.map((v) => Number(v));
  }

  getNewBatch() {
    this.getCompositions(this.getSelectedCities(), this.getSelectedLocations());
  }

  getCompositions(cities: number[], locations: number[]) {
    this.store.dispatch(
      CompositionActions.getCompositions({
        cities,
        locations,
        offset: this.offset,
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
