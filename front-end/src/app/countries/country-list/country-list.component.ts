import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, INITIAL_OFFSET } from '../../store/state';
import { countries } from '../../store/country/country.selectors';
import { CountryActions } from '../../store/country/country.actions';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { Subject, debounceTime, filter, take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CountryFormComponent } from '../country-form/country-form.component';
import { DialogService } from '../../shared/services/dialog.service';
import { BatchList } from '../../shared/batch-list';
import { ListActionsComponent } from '../../shared/list-actions/list-actions.component';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ScrollingModule,
    RouterLink,
    ListActionsComponent,
  ],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent extends BatchList implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  countries$ = this.store.select(countries);

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly dialogService: DialogService
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(CountryActions.getCountries());
    this.scrolled$.pipe(debounceTime(300)).subscribe(() => this.getOffset());
  }

  getNewBatch() {
    this.store.dispatch(CountryActions.getCountries(this.offset));
  }

  goToDetails(id: number) {
    this.router.navigate([`countries`, id]);
  }

  openCountryForm() {
    const dialogRef = this.dialogService.open(CountryFormComponent);
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((created) => created === true)
      )
      .subscribe(() => (this.offset = INITIAL_OFFSET));
  }

  deleteCountry(id: number) {
    this.store.dispatch(CountryActions.deleteCountry({ id }));
    this.offset = 0;
  }
}
