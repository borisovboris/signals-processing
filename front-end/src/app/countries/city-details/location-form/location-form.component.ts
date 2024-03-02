import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
} from '@angular/core';
import { DialogReference } from '../../../shared/services/dialog-reference';
import {
  MyErrorStateMatcher,
  isDefined,
  stringsLike,
} from '../../../shared/utils';
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

export interface LocationDialogData {
  cityId: number;
  editInfo?: {
    id: number;
    name: string;
    address: string;
    isOperational: boolean;
    coordinates?: string;
    description?: string;
  };
}

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [FormsModule, MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationFormComponent implements AfterViewInit {
  uniqueCityNameValidatorFn(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          const { cityId } = this.dialogData;
          return this.service
            .checkIfLocationNameExists(cityId, value)
            .pipe(map((exists) => [exists, value]));
        }),
        map(([exists, value]) => {
          if (exists && !stringsLike(this.dialogData.editInfo?.name, value)) {
            return { locationExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  dialogData: LocationDialogData = this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);
  matcher = new MyErrorStateMatcher();
  inEditMode = false;

  constructor(
    private readonly service: CountriesService,
    private readonly changeRef: ChangeDetectorRef,
    private readonly store: Store,
    private readonly injector: Injector
  ) {
    this.inEditMode = this.dialogData.editInfo !== undefined;
  }

  ngAfterViewInit() {
    if (this.dialogData.editInfo !== undefined) {
      this.locationName?.setValue(this.dialogData.editInfo.name);
      this.address?.setValue(this.dialogData.editInfo.address);
      this.isOperational?.setValue(this.dialogData.editInfo.isOperational);
      this.coordinates?.setValue(this.dialogData.editInfo.coordinates ?? null);
      this.description?.setValue(this.dialogData.editInfo.description ?? null);

      this.locationForm.markAllAsTouched();
      this.locationForm.updateValueAndValidity();
    }
  }

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
    isOperational: new FormControl<boolean>(false, { nonNullable: true }),
  });

  get locationName() {
    return this.locationForm.get('locationName');
  }

  get coordinates() {
    return this.locationForm.get('coordinates');
  }

  get address() {
    return this.locationForm.get('address');
  }

  get description() {
    return this.locationForm.get('description');
  }

  get isOperational() {
    return this.locationForm.get('isOperational');
  }

  get formPending() {
    return this.locationForm.pending;
  }

  createOrEditLocation() {
    if (this.inEditMode) {
      this.editLocation();
    } else {
      this.createLocation();
    }
  }

  editLocation() {
    const { cityId } = this.dialogData;
    const name = this.locationName?.value;
    const address = this.address?.value;
    const coordinates = this.coordinates?.value ?? undefined;
    const description = this.description?.value ?? undefined;
    const isOperational = this.isOperational?.value ?? false;

    if (
      isDefined(cityId) &&
      isDefined(this.dialogData.editInfo) &&
      isDefined(name) &&
      isDefined(address)
    ) {
      const location = {
        id: this.dialogData.editInfo.id,
        cityId,
        name,
        address,
        coordinates,
        description,
        isOperational,
      };

      this.store.dispatch(CountryActions.editLocation({ location }));
      this.dialogRef.close();
    }
  }

  createLocation() {
    const { cityId } = this.dialogData;
    const name = this.locationName?.value;
    const address = this.address?.value;
    const coordinates = this.coordinates?.value ?? undefined;
    const description = this.description?.value ?? undefined;
    const isOperational = this.isOperational?.value ?? false;

    if (isDefined(cityId) && isDefined(name) && isDefined(address)) {
      const location = {
        cityId,
        name,
        address,
        coordinates,
        description,
        isOperational,
      };

      this.store.dispatch(CountryActions.createLocation({ location }));
      this.dialogRef.close();
    }
  }

  locationChangedThroughEdit() {
    const nameChanged = this.dialogData.editInfo?.name !== this.locationName?.value;
    const addressChanged = this.dialogData.editInfo?.address !== this.address?.value;
    const coordinatesChanged = this.dialogData.editInfo?.coordinates !== this.coordinates?.value;
    const descriptionChanged = this.dialogData.editInfo?.description !== this.description?.value;
    const isOperationalChanged = this.dialogData.editInfo?.isOperational !== this.isOperational?.value;

    return nameChanged || addressChanged || coordinatesChanged || descriptionChanged || isOperationalChanged;
  }
}
