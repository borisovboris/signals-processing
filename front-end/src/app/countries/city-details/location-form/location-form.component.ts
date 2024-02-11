import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
} from '@angular/core';
import { DialogReference } from '../../../shared/services/dialog-reference';
import { MyErrorStateMatcher, isDefined } from '../../../shared/utils';
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
} from 'rxjs';
import { DIALOG_DATA } from '../../../shared/services/dialog.service';
import { CountryActions } from '../../../store/country/country.actions';
import { Store } from '@ngrx/store';
import { CountriesService } from '../../../../../generated-sources/openapi';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [FormsModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationFormComponent {
  uniqueCityNameValidatorFn(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          const { cityId } = this.dialogData;
          return this.service.checkIfLocationNameExists(cityId, value);
        }),
        map((exists: boolean) => {
          if (exists) {
            return { locationExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  dialogData: { cityId: number } = this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);
  matcher = new MyErrorStateMatcher();

  constructor(
    private readonly service: CountriesService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly store: Store,
    private readonly injector: Injector
  ) {}

  readonly locationForm = new FormGroup({
    locationName: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.uniqueCityNameValidatorFn().bind(this)],
    }),
    address: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    coordinates: new FormControl<string>(''),
    description: new FormControl<string>(''),
  });

  get locationName() {
    return this.locationForm.get('locationName');
  }

  get formPending() {
    return this.locationForm.pending;
  }

  createCity() {
    const { cityId } = this.dialogData;
    const name = this.locationName?.value;
    const address = this.locationForm.get('address')?.value;
    const coordinates =
      this.locationForm.get('coordinates')?.value ?? undefined;
    const description =
      this.locationForm.get('description')?.value ?? undefined;

    if (isDefined(cityId) && isDefined(name) && isDefined(address)) {
      const location = {
        cityId,
        name,
        address,
        coordinates,
        description,
      };

      this.store.dispatch(CountryActions.createLocation({ location }));
      this.dialogRef.close();
    }
  }
}
