import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
} from '@angular/core';
import { DialogReference } from '../../../shared/services/dialog-reference';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  switchMap,
  take,
} from 'rxjs';
import {
  LabeledValue,
  isNumericLabeledValue,
  labeledValueValidator,
} from '../../../shared/autocomplete-chips/autocomplete.model';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  CompositionsService,
  CountriesService,
} from '../../../../../generated-sources/openapi';
import { CommonModule } from '@angular/common';
import { SingleAutocompleteComponent } from '../../../shared/single-autocomplete/single-autocomplete.component';
import { MaterialModule } from '../../../material/material.module';
import { CompositionActions } from '../../../store/composition/composition.actions';
import { DIALOG_DATA } from '../../../shared/services/dialog.service';
import {
  getNullOrValue,
  getLabeledValue,
  stringsLike,
} from '../../../shared/utils';

export interface CompositionDialogData {
  editInfo?: {
    id: number;
    code: string;
    location: LabeledValue<number>;
    type: LabeledValue<number>;
    status: LabeledValue<number>;
    coordinates?: string;
    description?: string;
  };
}

@Component({
  selector: 'app-composition-form',
  standalone: true,
  imports: [
    CommonModule,
    SingleAutocompleteComponent,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './composition-form.component.html',
  styleUrl: './composition-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionFormComponent implements AfterViewInit {
  uniqueCodeValidator(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(() => isNumericLabeledValue(control.get('locationCtrl')?.value)),
        switchMap((value) =>
          this.compositionService
            .checkIfCompositionExists(
              control.get('locationCtrl')?.value.value,
              control.get('code')?.value
            )
            .pipe(map((exists) => [exists, value]))
        ),
        map(([exists, value]) => {
          if (
            exists &&
            !stringsLike(
              control.get('code')?.value,
              this.dialogData?.editInfo?.code
            )
          ) {
            control.get('code')?.setErrors({ locationExists: true });
          } else {
            delete control.get('code')?.errors?.['notAnOption'];
          }

          this.changeRef.markForCheck();

          return null;
        }),
        first()
      );
  }

  dialogData: CompositionDialogData | undefined =
    this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);
  inEditMode = false;

  locations$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  locationOptions$ = this.locations$.asObservable();
  locationCtrl: FormControl<LabeledValue<number> | string | null> =
    new FormControl('', [labeledValueValidator]);

  types$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  typeOptions$ = this.types$.asObservable();
  typeCtrl: FormControl<LabeledValue<number> | string | null> = new FormControl(
    '',
    [labeledValueValidator]
  );

  statuses$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  statusOptions$ = this.statuses$.asObservable();
  statusCtrl: FormControl<LabeledValue<number> | string | null> =
    new FormControl('', { validators: [labeledValueValidator] });

  form = new FormGroup({
    nestedForm: new FormGroup(
      {
        code: new FormControl<string>('', [Validators.required]),
        locationCtrl: this.locationCtrl,
      },
      { asyncValidators: [this.uniqueCodeValidator()] }
    ),
    typeCtrl: this.typeCtrl,
    statusCtrl: this.statusCtrl,
    coordinates: new FormControl<string>(''),
    description: new FormControl<string>(''),
  });

  constructor(
    private readonly store: Store,
    private readonly injector: Injector,
    private readonly compositionService: CompositionsService,
    private readonly countryService: CountriesService,
    private readonly changeRef: ChangeDetectorRef
  ) {
    this.inEditMode = this.dialogData?.editInfo !== undefined;
  }

  ngAfterViewInit() {
    if (this.dialogData?.editInfo !== undefined) {
      this.code?.setValue(this.dialogData.editInfo?.code);
      this.location?.setValue(this.dialogData.editInfo?.location);
      this.type?.setValue(this.dialogData.editInfo?.type);
      this.status?.setValue(this.dialogData.editInfo?.status);
      this.coordinates?.setValue(
        getNullOrValue(this.dialogData.editInfo?.coordinates)
      );
      this.description?.setValue(
        getNullOrValue(this.dialogData.editInfo?.description)
      );

      this.form.markAllAsTouched();
      this.form.updateValueAndValidity;
    }
  }

  onLocationInput(text: string) {
    this.countryService
      .readLocations({ name: text })
      .pipe(
        map((compositions) =>
          compositions.map((c) => ({ label: c.name, value: c.id }))
        ),
        take(1)
      )
      .subscribe((data) => this.locations$.next(data));
  }

  onStatusInput(text: string) {
    this.compositionService
      .readCompositionStatuses({ name: text })
      .pipe(take(1))
      .subscribe((data) => this.statuses$.next(data));
  }

  onTypeInput(text: string) {
    this.compositionService
      .readCompositionTypes({ name: text })
      .pipe(take(1))
      .subscribe((data) => this.types$.next(data));
  }

  get formPending() {
    return this.form.pending;
  }

  codeExists() {
    return this.code?.hasError('locationExists');
  }

  get code() {
    return this.form.get('nestedForm')?.get('code');
  }

  get location() {
    return this.form.get('nestedForm')?.get('locationCtrl');
  }

  get coordinates() {
    return this.form.get('coordinates');
  }

  get description() {
    return this.form.get('description');
  }

  get type() {
    return this.form.get('typeCtrl');
  }

  get status() {
    return this.form.get('statusCtrl');
  }

  createOrEditComposition() {
    if(this.inEditMode) {
      this.editComposition();
    } else {
      this.createComposition();
    }
  }

  editComposition() {
    const { code, coordinates, description, location, type, status } =
      this.getCompositionData();
    const id = this.dialogData?.editInfo?.id;

    if (
      code &&
      id &&
      isNumericLabeledValue(location) &&
      isNumericLabeledValue(type) &&
      isNumericLabeledValue(status)
    ) {
      this.store.dispatch(
        CompositionActions.editComposition({
          composition: {
            id,
            code,
            coordinates,
            description,
            statusId: status.value,
            typeId: type.value,
            locationId: location.value,
          },
        })
      );
    }

    this.dialogRef.close(true);
  }

  createComposition() {
    const { code, coordinates, description, location, type, status } =
      this.getCompositionData();

    if (
      code &&
      isNumericLabeledValue(location) &&
      isNumericLabeledValue(type) &&
      isNumericLabeledValue(status)
    ) {
      this.store.dispatch(
        CompositionActions.createComposition({
          composition: {
            code,
            coordinates,
            description,
            statusId: location.value,
            typeId: type.value,
            locationId: status.value,
          },
        })
      );
    }

    this.dialogRef.close(true);
  }

  getCompositionData() {
    const code = this.code?.value ?? undefined;
    const coordinates = this.coordinates?.value ?? undefined;
    const description = this.description?.value ?? undefined;
    const location = this.location?.value;
    const type = this.type?.value;
    const status = this.status?.value;

    return { code, coordinates, description, location, type, status };
  }

  compositionChangedThroughEdit() {
    if (this.dialogData?.editInfo === undefined) {
      return true;
    }

    const {
      code: codeCtrl,
      coordinates: coordinatesCtrl,
      description: descriptionCtrl,
      location: locationCtrl,
      type: typeCtrl,
      status: statusCtrl,
    } = this.getCompositionData();

    const { code, coordinates, description, location, type, status } =
      this.dialogData.editInfo;

    const codeChanged = !stringsLike(code, codeCtrl);
    const coordinatesChanged = !stringsLike(coordinates, coordinatesCtrl);
    const descriptionChanged = !stringsLike(description, descriptionCtrl);
    const locationChanged = location.value !== getLabeledValue(locationCtrl);
    const typeChanged = type.value !== getLabeledValue(typeCtrl);
    const statusChanged = status.value !== getLabeledValue(statusCtrl);

    return (
      codeChanged ||
      coordinatesChanged ||
      descriptionChanged ||
      locationChanged ||
      typeChanged ||
      statusChanged
    );
  }
}
