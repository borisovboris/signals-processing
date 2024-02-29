import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
} from '@angular/core';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { CountriesService } from '../../../../../generated-sources/openapi';
import { Store } from '@ngrx/store';
import {
  MyErrorStateMatcher,
  isDefined,
  stringsLike,
} from '../../../shared/utils';
import { DialogReference } from '../../../shared/services/dialog-reference';
import { CountryActions } from '../../../store/country/country.actions';
import { DIALOG_DATA } from '../../../shared/services/dialog.service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  map,
  switchMap,
} from 'rxjs';

export interface CityDialogData {
  countryId: number;
  cityId?: number;
  name?: string;
  postalCode?: string;
}

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [FormsModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './city-form.component.html',
  styleUrl: './city-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityFormComponent implements AfterViewInit {
  uniqueCityNameValidatorFn(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          const { countryId } = this.dialogData;
          return this.service
            .checkIfCityExists(countryId, value)
            .pipe(map((exists) => [exists, value]));
        }),
        map(([exists, value]) => {
          if (exists && !stringsLike(this.dialogData.name, value)) {
            return { countryExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  uniquePostalCodeValidatorFn(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          const { countryId } = this.dialogData;
          return this.service
            .checkIfPostalCodeExists(countryId, value)
            .pipe(map((exists) => [exists, value]));
        }),
        map(([exists, value]) => {
          if (exists && !stringsLike(this.dialogData.postalCode, value)) {
            return { postalCodeExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  dialogData: CityDialogData = this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);
  matcher = new MyErrorStateMatcher();
  inEditMode = false;

  constructor(
    private readonly service: CountriesService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly store: Store,
    private readonly injector: Injector
  ) {
    if (this.dialogData.name !== undefined) {
      this.inEditMode = true;
    }
  }

  ngAfterViewInit() {
    const name = this.dialogData.name;
    const postalCode = this.dialogData.postalCode;

    if (name && postalCode) {
      this.cityForm.get('cityName')?.setValue(name);
      this.cityForm.get('postalCode')?.setValue(postalCode);

      this.cityForm.markAllAsTouched();
      this.cityForm.updateValueAndValidity();
    }
  }

  readonly cityForm = new FormGroup({
    cityName: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.uniqueCityNameValidatorFn().bind(this)],
    }),
    postalCode: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.uniquePostalCodeValidatorFn().bind(this)],
    }),
  });

  get cityName() {
    return this.cityForm.get('cityName');
  }

  get postalCode() {
    return this.cityForm.get('postalCode');
  }

  get formPending() {
    return this.cityForm.pending;
  }

  saveCity() {
    if (this.inEditMode) {
      this.editCity();
    } else {
      this.createCity();
    }
  }

  editCity() {
    const name = this.cityName?.value;
    const postalCode = this.postalCode?.value;
    const { countryId } = this.dialogData;
    const { cityId } = this.dialogData;

    if (name && postalCode && countryId && cityId) {
      this.store.dispatch(
        CountryActions.editCity({
          city: { name, postalCode, countryId, id: cityId },
        })
      );
      this.dialogRef.close(true);
    }
  }

  createCity() {
    const name = this.cityName?.value;
    const postalCode = this.postalCode?.value;
    const { countryId } = this.dialogData;

    if (isDefined(name) && isDefined(postalCode)) {
      const city = {
        name,
        postalCode,
        countryId,
      };

      this.store.dispatch(CountryActions.createCity({ city }));
      this.dialogRef.close(true);
    }
  }

  get cityChangedThroughEdit() {
    const cityNameChanged = !stringsLike(
      this.cityName?.value,
      this.dialogData?.name
    );
    const postalCodeChanged = !stringsLike(
      this.postalCode?.value,
      this.dialogData?.postalCode
    );

    return cityNameChanged || postalCodeChanged;
  }
}
