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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteChipsComponent } from '../../shared/autocomplete-chips/autocomplete-chips.component';
import { CityNameChipsAutocompleteComponent } from '../autocompletes/city-name-chips-autocomplete/city-name-chips-autocomplete.component';
import { LocationNameChipsAutocompleteComponent } from '../autocompletes/location-name-chips-autocomplete/location-name-chips-autocomplete.component';
import { isDefined } from '../../shared/utils';
import { take } from 'rxjs';
import { DialogService } from '../../shared/services/dialog.service';
import { CompositionFormComponent } from './composition-form/composition-form.component';

@Component({
  selector: 'app-compositions-list',
  standalone: true,
  imports: [
    AutocompleteChipsComponent,
    CityNameChipsAutocompleteComponent,
    LocationNameChipsAutocompleteComponent,
    CommonModule,
    MaterialModule,
    ScrollingModule,
  ],
  templateUrl: './compositions-list.component.html',
  styleUrl: './compositions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionsListComponent implements AfterViewInit {
  @ViewChild(CityNameChipsAutocompleteComponent)
  cityNameAutoComplete!: CityNameChipsAutocompleteComponent;
  @ViewChild(LocationNameChipsAutocompleteComponent)
  locationNameAutoComplete!: LocationNameChipsAutocompleteComponent;
  cityName?: string;
  locationName?: string;

  compositions$ = this.store.select(compositions);
  cityNames: string[] = [];
  locationNames: string[] = [];

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
  ) {}

  ngOnInit(): void {
   
  }

  getOperationalLabel(operational: boolean) {
    return operational ? 'Operational' : 'Not operational';
  }

  onCityNameFilter(names: string[]) {
    this.cityNames = names;
    this.getCompositions();
  }

  onLocationNameFilter(names: string[]) {
    this.locationNames = names;
    this.getCompositions();
  }

  setInitialCityAndCountryName(cityName: string, locationName: string) {
    this.cityNameAutoComplete.setChips([cityName]);
    this.locationNameAutoComplete.setChips([locationName]);
  }

  ngAfterViewInit() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.cityName = params['cityName'];
      this.locationName = params['locationName'];

      if (isDefined(this.cityName) && isDefined(this.locationName)) {
        this.setInitialCityAndCountryName(this.cityName, this.locationName);

        this.store.dispatch(
          CompositionActions.getCompositions({
            filters: {
              cityNames: [this.cityName],
              locationNames: [this.locationName],
            },
          })
        );

        return;
      }

      this.store.dispatch(CompositionActions.getCompositions({}));
    });
  }

  getCompositions() {
    this.store.dispatch(
      CompositionActions.getCompositions({
        filters: {
          cityNames: this.cityNames,
          locationNames: this.locationNames,
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
