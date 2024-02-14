import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CountriesService } from '../../../../../generated-sources/openapi';
import { AutoComplete } from '../../../shared/autocomplete-chips/autocomplete.model';
import { BehaviorSubject, map, take } from 'rxjs';
import { AutocompleteChipsComponent } from '../../../shared/autocomplete-chips/autocomplete-chips.component';

@Component({
  selector: 'app-location-name-chips-autocomplete',
  standalone: true,
  imports: [AutocompleteChipsComponent],
  templateUrl: './location-name-chips-autocomplete.component.html',
  styleUrl: './location-name-chips-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationNameChipsAutocompleteComponent implements AutoComplete {
  locations$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  options$ = this.locations$.asObservable();
  @Output() itemsUpdated = new EventEmitter<string[]>();
  @ViewChild(AutocompleteChipsComponent)
  autocomplete!: AutocompleteChipsComponent;
  
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
