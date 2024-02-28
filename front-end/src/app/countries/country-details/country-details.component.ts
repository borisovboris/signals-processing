import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import { cities } from '../../store/country/country.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { DialogService } from '../../shared/services/dialog.service';
import { CityFormComponent } from './city-form/city-form.component';
import { BatchList } from '../../shared/batch-list';
import { debounceTime, filter, take } from 'rxjs';
import { ListActionsComponent } from '../../shared/list-actions/list-actions.component';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ScrollingModule, ListActionsComponent],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailsComponent extends BatchList implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  cities$ = this.store.select(cities);
  countryId?: number;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.countryId = Number(this.route.snapshot.paramMap.get('countryId'));
    this.scrolled$.pipe(debounceTime(300)).subscribe(() => this.getOffset());

    this.store.dispatch(
      CountryActions.getCitiesOfCountry({
        countryId: this.countryId,
        offset: 0,
      })
    );
  }

  getNewBatch() {
    this.store.dispatch(
      CountryActions.getCitiesOfCountry({
        countryId: this.countryId,
        offset: this.offset,
      })
    );
  }

  goToCity(id: number) {
    this.router.navigate([`/countries/cities`, id]);
  }

  openCityForm() {
    if (this.countryId !== undefined) {
      this.dialogService
        .open(CityFormComponent, {
          data: { countryId: this.countryId },
        })
        .afterClosed()
        .pipe(
          take(1),
          filter((result) => result === true)
        )
        .subscribe((_) => (this.offset = 0));
    }
  }
}
