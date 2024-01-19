import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { AutocompleteComponent } from '../../../shared/autocomplete/autocomplete.component';
import { BehaviorSubject, map } from 'rxjs';
import { CountriesService } from '../../../../../generated-sources/openapi';

@Component({
  selector: 'app-city-name-autocomplete',
  standalone: true,
  imports: [CommonModule, AutocompleteComponent],
  templateUrl: './city-name-autocomplete.component.html',
  styleUrl: './city-name-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityNameAutocompleteComponent {
  cities$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  options$ = this.cities$.asObservable();
  @Output() itemsUpdated = new EventEmitter<string[]>();

  constructor(private readonly service: CountriesService) {}

  onUserInput(text: string) {
    this.service
      .readCitiesLikeName(text!)
      .pipe(map((cities) => cities.map((city) => city.name)))
      .subscribe((data) => this.cities$.next(data));
  }

  onItemsUpdated(cities: string[]) {
    this.cities$.next([]);
    this.itemsUpdated.emit(cities);
  }
}
