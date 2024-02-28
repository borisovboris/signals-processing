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
import {
  CompositionsService,
  EditedDeviceDTO,
} from '../../../../../generated-sources/openapi';
import { SingleAutocompleteComponent } from '../../../shared/single-autocomplete/single-autocomplete.component';
import { CommonModule } from '@angular/common';
import { stringsLike } from '../../../shared/utils';

export interface CreateEditDevice {
  compositionId: number;
  editInfo?: {
    status: LabeledValue<number>;
    deviceName: string;
    deviceCode: string;
    deviceId: number;
  };
}

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
export class DeviceFormComponent implements AfterViewInit {
  uniqueCodeValidator(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) =>
          this.compositionService
            .checkIfDeviceCodeExists(this.dialogData.compositionId, value)
            .pipe(map((exists) => [exists, value]))
        ),
        map(([exists, value]) => {
          if (
            exists === true &&
            !stringsLike(value, this.dialogData.editInfo?.deviceCode)
          ) {
            return { deviceCodeExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      );
  }

  uniqueNameValidator(): AsyncValidatorFn {
    return (control) =>
      control.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value) => {
          return this.compositionService
            .checkIfDeviceNameExists(this.dialogData.compositionId, value)
            .pipe(map((exists) => [exists, value]));
        }),
        map(([exists, value]) => {
          if (
            exists === true &&
            !stringsLike(value, this.dialogData.editInfo?.deviceName)
          ) {
            return { deviceNameExists: true };
          }

          return null;
        }),
        first(),
        finalize(() => this.changeRef.markForCheck())
      );
  }

  dialogData: CreateEditDevice = this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);

  statuses$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  statusOptions$ = this.statuses$.asObservable();
  statusCtrl: FormControl<LabeledValue<number> | string | null> =
    new FormControl(null, [labeledValueValidator]);

  inEditMode: boolean;
  dialogTitle: string;
  actionButtonText: string;

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
  ) {
    const inEditMode = this.dialogData.editInfo !== undefined ? true : false;
    this.inEditMode = inEditMode;
    this.actionButtonText = inEditMode ? 'Edit' : 'Save';
    this.dialogTitle = inEditMode ? 'Edit device' : 'Add device';
  }

  ngAfterViewInit() {
    if (this.dialogData.editInfo !== undefined) {
      this.deviceForm.get('status')?.setValue(this.dialogData.editInfo.status);
      this.deviceForm
        .get('deviceCode')
        ?.setValue(this.dialogData.editInfo.deviceCode);
      this.deviceForm
        .get('deviceName')
        ?.setValue(this.dialogData.editInfo.deviceName);

      this.deviceForm.markAllAsTouched();
      this.deviceForm.updateValueAndValidity();
    }
  }

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

  get deviceStatus() {
    return this.deviceForm.controls['status'];
  }

  saveOrEditDevice() {
    if (this.inEditMode) {
      this.editDevice();
    } else {
      this.saveDevice();
    }
  }

  saveDevice() {
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
      this.close();
    }
  }

  editDevice() {
    const compositionId = this.dialogData.compositionId;
    const deviceCode = this.deviceCode.value;
    const deviceName = this.deviceName.value;
    const status = this.deviceForm.controls['status'].value;
    const deviceId = this.dialogData.editInfo?.deviceId;

    if (
      compositionId !== undefined &&
      deviceCode &&
      deviceName &&
      deviceId !== undefined &&
      isNumericLabeledValue(status)
    ) {
      const data: EditedDeviceDTO = {
        compositionId,
        deviceCode,
        deviceName,
        deviceId,
        statusId: status.value,
      };

      this.store.dispatch(CompositionActions.editDevice({ device: data }));
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }

  deviceChangedThroughEdit() {
    if (this.dialogData.editInfo === undefined) {
      return true;
    }

    const { deviceCode, deviceName, status } = this.dialogData.editInfo;

    const codeChanged =
      deviceCode.toLowerCase() !== this.deviceCode.value?.toLowerCase();
    const nameChanged =
      deviceName.toLowerCase() !== this.deviceName.value?.toLowerCase();
    const statusChanged =
      status.value !== this.getStatusValue(this.deviceStatus.value);

    return codeChanged || nameChanged || statusChanged;
  }

  getStatusValue(
    input: LabeledValue<number> | string | null
  ): number | null | string {
    if (isNumericLabeledValue(input)) {
      return input.value;
    }

    return input;
  }
}
