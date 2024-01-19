import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';
import { compositions } from '../../store/composition/composition.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { CityNameAutocompleteComponent } from '../autocompletes/city-name-autocomplete/city-name-autocomplete.component';

@Component({
  selector: 'app-compositions-list',
  standalone: true,
  imports: [
    AutocompleteComponent,
    CityNameAutocompleteComponent,
    CommonModule,
    MaterialModule,
    ScrollingModule,
  ],
  templateUrl: './compositions-list.component.html',
  styleUrl: './compositions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionsListComponent {
  compositions$ = this.store.select(compositions);
  value = '';

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.dispatch(CompositionActions.getCompositions({}));
  }

  getOperationalLabel(operational: boolean) {
    return operational ? 'Operational' : 'Not operational';
  }

  onCityNameFilter(names: string[]) {
    this.store.dispatch(
      CompositionActions.getCompositions({ filters: { cityNames: names } })
    );
  }
}
