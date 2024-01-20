import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';
import { compositions } from '../../store/composition/composition.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { CityNameAutocompleteComponent } from '../autocompletes/city-name-autocomplete/city-name-autocomplete.component';
import { LocationNameAutocompleteComponent } from '../autocompletes/location-name-autocomplete/location-name-autocomplete.component';
import { isDefined } from '../../shared/utils';

@Component({
  selector: 'app-compositions-list',
  standalone: true,
  imports: [
    AutocompleteComponent,
    CityNameAutocompleteComponent,
    LocationNameAutocompleteComponent,
    CommonModule,
    MaterialModule,
    ScrollingModule,
  ],
  templateUrl: './compositions-list.component.html',
  styleUrl: './compositions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionsListComponent implements AfterViewInit {
  @ViewChild(CityNameAutocompleteComponent)
  cityNameAutoComplete!: CityNameAutocompleteComponent;
  @ViewChild(LocationNameAutocompleteComponent)
  locationNameAutoComplete!: LocationNameAutocompleteComponent;
  cityName?: string;
  locationName?: string;

  compositions$ = this.store.select(compositions);
  cityNames: string[] = [];
  locationNames: string[] = [];

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
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
    this.route.queryParams.subscribe((params) => {
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
}
