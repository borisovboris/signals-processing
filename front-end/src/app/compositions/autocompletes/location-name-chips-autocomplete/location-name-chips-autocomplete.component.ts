import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CountriesService } from '../../../../../generated-sources/openapi';
import { AutoComplete } from '../../../shared/autocomplete/autocomplete.model';
import { BehaviorSubject, map, take } from 'rxjs';
import { AutocompleteComponent } from '../../../shared/autocomplete/autocomplete.component';

@Component({
  selector: 'app-location-name-chips-autocomplete',
  standalone: true,
  imports: [AutocompleteComponent],
  templateUrl: './location-name-chips-autocomplete.component.html',
  styleUrl: './location-name-chips-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationNameChipsAutocompleteComponent implements AutoComplete {
  locations$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  options$ = this.locations$.asObservable();
  @Output() itemsUpdated = new EventEmitter<string[]>();
  @ViewChild(AutocompleteComponent)
  autocomplete!: AutocompleteComponent;
  
  constructor(private readonly service: CountriesService) {}

  onUserInput(text: string) {
    this.service
      .readLocationsLikeName(text!)
      .pipe(
        map((locations) => locations.map((city) => city.name)),
        take(1)
      )
      .subscribe((data) => this.locations$.next(data));
  }

  onItemsUpdated(locations: string[]) {
    this.locations$.next([]);
    this.itemsUpdated.emit(locations);
  }

  setChips(chips: string[]) {
    this.autocomplete.setChips(chips);
  }
}
