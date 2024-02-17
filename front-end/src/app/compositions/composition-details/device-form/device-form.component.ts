import {
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
import { Store } from '@ngrx/store';
import { MaterialModule } from '../../../material/material.module';
import { DialogReference } from '../../../shared/services/dialog-reference';
import { DIALOG_DATA } from '../../../shared/services/dialog.service';
import { CompositionActions } from '../../../store/composition/composition.actions';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  finalize,
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
import { CompositionsService } from '../../../../../generated-sources/openapi';
import { SingleAutocompleteComponent } from '../../../shared/single-autocomplete/single-autocomplete.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SingleAutocompleteComponent,
    CommonModule,
  ],
  templateUrl: './device-form.component.html',
  styleUrl: './device-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceFormComponent {
  uniqueCodeValidator(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) =>
          this.compositionService.checkIfDeviceCodeExists(
            this.dialogData.compositionId,
            value
          )
        ),
        map((exists: boolean) => {
          if (exists) {
            return { deviceCodeExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  uniqueNameValidator(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) =>
          this.compositionService.checkIfDeviceNameExists(
            this.dialogData.compositionId,
            value
          )
        ),
        map((exists: boolean) => {
          if (exists) {
            return { deviceNameExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      ); // important to make observable finite
  }

  dialogData: any = this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);

  statuses$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  statusOptions$ = this.statuses$.asObservable();
  statusCtrl: FormControl<LabeledValue<number> | string | null> =
    new FormControl('', [labeledValueValidator]);

  readonly deviceForm = new FormGroup({
    deviceCode: new FormControl<string>(
      '',
      Validators.required,
      this.uniqueCodeValidator().bind(this)
    ),
    deviceName: new FormControl<string>(
      '',
      Validators.required,
      this.uniqueNameValidator().bind(this)
    ),
    status: this.statusCtrl,
  });

  constructor(
    private readonly store: Store,
    private readonly injector: Injector,
    private readonly compositionService: CompositionsService,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  onStatusInput(text: string) {
    this.compositionService
      .readDeviceStatuses({ name: text })
      .pipe(
        map((statuses) =>
          statuses.map((c) => ({ label: c.name, value: c.id }))
        ),
        take(1)
      )
      .subscribe((data) => this.statuses$.next(data));
  }

  get deviceCode() {
    return this.deviceForm.controls['deviceCode'];
  }

  get deviceName() {
    return this.deviceForm.controls['deviceName'];
  }

  onSubmit() {
    const compositionId = this.dialogData.compositionId;
    const deviceCode = this.deviceCode.value;
    const deviceName = this.deviceName.value;
    const status = this.deviceForm.controls['status'].value;

    if (
      compositionId !== undefined &&
      deviceCode &&
      deviceName &&
      isNumericLabeledValue(status)
    ) {
      const device = {
        compositionId,
        deviceCode,
        deviceName,
        statusId: status.value,
      };

      this.store.dispatch(CompositionActions.createDevice({ device }));
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
