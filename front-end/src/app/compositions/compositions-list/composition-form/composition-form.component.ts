import {
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
import { LabeledValue, isNumericLabeledValue, labeledValueValidator } from '../../../shared/autocomplete-chips/autocomplete.model';
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
export class CompositionFormComponent {


  myCustomValidator(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(_ => isNumericLabeledValue(control.get('locationCtrl')?.value)),
        switchMap(() =>
          this.compositionService.checkIfCompositionExists(
            control.get('locationCtrl')?.value.value,
            control.get('code')?.value
          )
        ),
        map((exists: boolean) => {
          if (exists) {
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

  dialogRef: DialogReference = this.injector.get(DialogReference);

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
    '', [labeledValueValidator],
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
      { asyncValidators: [this.myCustomValidator()] }
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
      .pipe(
        map((statuses) =>
          statuses.map((c) => ({ label: c.name, value: c.id }))
        ),
        take(1)
      )
      .subscribe((data) => this.statuses$.next(data));
  }

  onTypeInput(text: string) {
    this.compositionService
      .readCompositionTypes({ name: text })
      .pipe(
        map((types) => types.map((c) => ({ label: c.name, value: c.id }))),
        take(1)
      )
      .subscribe((data) => this.types$.next(data));
  }

  get formPending() {
    return this.form.pending;
  }

  codeExists() {
   return this.form.get('nestedForm')?.get('code')?.hasError('locationExists');
  }

  createComposition() {
    const code = this.form.get('nestedForm')?.get('code')?.value ?? undefined;
    const coordinates = this.form.get('coordination')?.value ?? undefined;
    const description = this.form.get('description')?.value ?? undefined;

    const location = this.form.get('nestedForm')?.get('locationCtrl')?.value;
    const type = this.form?.get('typeCtrl')?.value;
    const status = this.form?.get('statusCtrl')?.value;

    if (
      code !== undefined &&
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

    this.dialogRef.close();
  }
}
