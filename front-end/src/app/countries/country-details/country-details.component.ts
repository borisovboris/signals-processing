import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import { cities } from '../../store/country/country.selectors';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DialogService } from '../../shared/services/dialog.service';
import { CityFormComponent } from './city-form/city-form.component';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ScrollingModule],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailsComponent implements OnInit {
  cities$ = this.store.select(cities);
  countryId?: number;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.countryId = Number(this.route.snapshot.paramMap.get('countryId'));

    this.store.dispatch(
      CountryActions.getCitiesOfCountry({ countryId: this.countryId })
    );
  }

  goToCity(id: number) {
    this.router.navigate([`/countries/cities`, id]);
  }

  openCityForm() {
    if (this.countryId !== undefined) {
      this.dialogService.open(CityFormComponent, {
        data: { countryId: this.countryId },
      });
    }
  }
}
