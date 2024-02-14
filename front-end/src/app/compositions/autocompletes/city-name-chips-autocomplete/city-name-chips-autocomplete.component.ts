import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { AutocompleteChipsComponent } from '../../../shared/autocomplete-chips/autocomplete-chips.component';
import { BehaviorSubject, map, take } from 'rxjs';
import { CountriesService } from '../../../../../generated-sources/openapi';
import { AutoComplete } from '../../../shared/autocomplete-chips/autocomplete.model';

@Component({
  selector: 'app-city-name-chips-autocomplete',
  standalone: true,
  imports: [CommonModule, AutocompleteChipsComponent],
  templateUrl: './city-name-chips-autocomplete.component.html',
  styleUrl: './city-name-chips-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityNameChipsAutocompleteComponent implements AutoComplete {
  cities$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  options$ = this.cities$.asObservable();
  @Output() itemsUpdated = new EventEmitter<string[]>();
  @ViewChild(AutocompleteChipsComponent)
  autocomplete!: AutocompleteChipsComponent;

  constructor(private readonly service: CountriesService) {}

  onUserInput(text: string) {
    this.service
      .readCitiesLikeName(text!)
      .pipe(
        map((cities) => cities.map((city) => city.name)),
        take(1)
      )
      .subscribe((data) => this.cities$.next(data));
  }

  onItemsUpdated(cities: string[]) {
    this.cities$.next([]);
    this.itemsUpdated.emit(cities);
  }

  setChips(chips: string[]) {
    this.autocomplete.setChips(chips);
  }
}
