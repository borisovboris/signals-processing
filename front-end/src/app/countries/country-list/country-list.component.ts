import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state';
import { countries } from '../../store/country/country.selectors';
import { CountryActions } from '../../store/country/country.actions';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { Subject, debounceTime } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, ScrollingModule, RouterLink],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;
  private scrolled$ = new Subject<void>();
  maxIndexReached = 0;

  countries$ = this.store.select(countries);

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.store.dispatch(CountryActions.getCountries());
    this.scrolled$.pipe(debounceTime(300)).subscribe(() => this.getNewBatch());
  }

  onScroll() {
    this.scrolled$.next();
  }

  getNewBatch() {
    const renderedEnd = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (renderedEnd === total && renderedEnd > this.maxIndexReached) {
      this.store.dispatch(CountryActions.getCountriesWithOffset());
      this.maxIndexReached = renderedEnd;
    }
  }

  goToDetails(id: number) {
    this.router.navigate([`details`], { relativeTo: this.route, queryParams: { id } });
  }
}
