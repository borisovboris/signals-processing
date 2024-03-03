import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
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
import {
  CountryDialogData,
  CountryFormComponent,
} from '../country-form/country-form.component';
import { DialogService } from '../../shared/services/dialog.service';
import { BatchList } from '../../shared/batch-list';
import { ListActionsComponent } from '../../shared/list-actions/list-actions.component';
import { stringsLike } from '../../shared/utils';
import { DialogReference } from '../../shared/services/dialog-reference';
import { NoDataComponent } from '../../shared/no-data/no-data.component';
import { fadeIn, fadeOut } from '../../shared/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CountryDTO } from '../../../../generated-sources/openapi';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ScrollingModule,
    RouterLink,
    ListActionsComponent,
    NoDataComponent,
  ],
  animations: [fadeIn],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent extends BatchList implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  private readonly destroyedRef = inject(DestroyRef);

  countries?: CountryDTO[];

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly changeRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(CountryActions.getCountries());
    this.scrolled$.pipe(debounceTime(300)).subscribe(() => this.getOffset());
    this.store
      .select(countries)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe((data) => {
        this.countries = data;
        this.changeRef.markForCheck();
      });
  }

  getNewBatch() {
    this.store.dispatch(CountryActions.getCountries(this.offset));
  }

  goToDetails(id: number) {
    this.router.navigate([`countries`, id]);
  }

  openCountryFormForCreation() {
    const dialogRef = this.dialogService.open(CountryFormComponent);
    this.onDialogClosed(dialogRef);
  }

  openCountryFormForEdit(id: number, name: string) {
    const data: CountryDialogData = {
      id,
      name,
    };

    const dialogRef = this.dialogService.open(CountryFormComponent, { data });
    this.onDialogClosed(dialogRef);
  }

  onDialogClosed(ref: DialogReference) {
    ref
      .afterClosed()
      .pipe(
        take(1),
        filter((completed) => completed === true)
      )
      .subscribe(() => (this.offset = INITIAL_OFFSET));
  }

  deleteCountry(id: number) {
    this.store.dispatch(CountryActions.deleteCountry({ id }));
    this.offset = 0;
  }
}
