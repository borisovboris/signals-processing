import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  inject,
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
import {
  MyErrorStateMatcher,
  isDefined,
  stringsLike,
} from '../../shared/utils';
import { DialogReference } from '../../shared/services/dialog-reference';
import { DIALOG_DATA } from '../../shared/services/dialog.service';

export interface CountryDialogData {
  id?: number;
  name?: string;
}

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [FormsModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryFormComponent implements AfterViewInit {
  uniqueCountryValidatorFn(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) =>
          this.service
            .checkIfCountryExists(value)
            .pipe(map((exists) => [exists, value]))
        ),
        map(([exists, value]) => {
          if (exists && !stringsLike(this.dialogData?.name, value)) {
            return { countryExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  dialogData?: CountryDialogData = inject(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);
  matcher = new MyErrorStateMatcher();
  inEditMode = false;

  constructor(
    private readonly service: CountriesService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly store: Store,
    private readonly injector: Injector
  ) {
    this.inEditMode = this.dialogData?.name !== undefined;
  }

  ngAfterViewInit(): void {
    if (this.dialogData?.name !== undefined) {
      this.countryName?.setValue(this.dialogData.name);

      this.countryForm.markAllAsTouched();
      this.countryForm.updateValueAndValidity();
    }
  }

  readonly countryForm = new FormGroup({
    countryName: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.uniqueCountryValidatorFn().bind(this)],
    }),
  });

  get countryName() {
    return this.countryForm.get('countryName');
  }

  saveCountry() {
    if (this.inEditMode) {
      this.editCountry();
    } else {
      this.createCountry();
    }
  }

  editCountry() {
    const  id = this.dialogData?.id;
    const name = this.countryName?.value;

    if (id && name) {
      this.store.dispatch(
        CountryActions.editCountry({ country: { id, name } })
      );
      this.dialogRef.close(true);
    }
  }

  createCountry() {
    const name = this.countryName?.value;

    if (isDefined(name)) {
      this.store.dispatch(CountryActions.createCountry({ name }));
      this.dialogRef.close(true);
    }
  }

  countryChangedThroughEdit() {
    return !stringsLike(this.countryName?.value, this.dialogData?.name);
  }

  formPending() {
    return this.countryForm.pending;
  }
}
