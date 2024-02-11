import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  map,
  switchMap,
} from 'rxjs/operators';
import { CountriesService } from '../../../../generated-sources/openapi';
import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import { MyErrorStateMatcher, isDefined } from '../../shared/utils';
import { DialogReference } from '../../shared/services/dialog-reference';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [FormsModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryFormComponent {
  uniqueCountryValidatorFn(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => this.service.checkIfCountryExists(value)),
        map((exists: boolean) => {
          if (exists) {
            return { countryExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  dialogRef: DialogReference = this.injector.get(DialogReference);
  matcher = new MyErrorStateMatcher();

  constructor(
    private readonly service: CountriesService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly store: Store,
    private readonly injector: Injector
  ) {}

  readonly countryForm = new FormGroup({
    countryName: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.uniqueCountryValidatorFn().bind(this)],
    }),
  });

  get countryName() {
    return this.countryForm.get('countryName');
  }

  createCountry() {
    const name = this.countryName?.value;

    if (isDefined(name)) {
      this.store.dispatch(CountryActions.createCountry({ name }));
      this.dialogRef.close();
    }
  }
}
