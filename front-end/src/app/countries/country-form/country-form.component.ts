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
  FormGroupDirective,
  FormsModule,
  NgForm,
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

import { ErrorStateMatcher } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { CountryActions } from '../../store/country/country.actions';
import { isDefined } from '../../shared/utils';
import { DialogReference } from '../../shared/services/dialog-reference';

// mat-input by default does not consider control errors until the the input
// is focused out. This error state matcher ensures that errors are immediately shown
// while the user is using the input.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

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

  constructor(
    private readonly service: CountriesService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly store: Store,
    private readonly injector: Injector
  ) {}

  matcher = new MyErrorStateMatcher();

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
