import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  filter,
  map,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CountriesService } from '../../../../generated-sources/openapi';
import { isDefined } from '../utils';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements OnInit, OnDestroy {
  cityCtrl = new FormControl('');
  cities$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  destroy$ = new Subject<void>();
  chips: string[] = [];
  @Output() itemsUpdated = new EventEmitter<string[]>();

  @ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;

  constructor(private readonly service: CountriesService) {}

  ngOnInit() {
    this.cityCtrl.valueChanges
      .pipe(
        debounceTime(100),
        filter((input) => isDefined(input) && input.length > 0),
        switchMap((data) => {
          return this.service
            .readCitiesLikeName(data!)
            .pipe(map((cities) => cities.map((city) => city.name)));
        }),
        map((cities) => {
          this.cities$.next(cities);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  remove(city: string): void {
    const index = this.chips.indexOf(city);

    if (index >= 0) {
      this.chips.splice(index, 1);
      this.itemsUpdated.emit(this.chips.slice());
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.cities$.next([]);

    const cityToAdd = event.option.viewValue;

    if (!this.chips.includes(cityToAdd)) {
      this.chips.push(cityToAdd);
      this.itemsUpdated.emit(this.chips.slice());
    }

    this.cityInput.nativeElement.value = '';
    this.cityCtrl.setValue(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
