import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DIALOG_DATA,
  DialogConfig,
} from '../../shared/services/dialog.service';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';
import { DialogReference } from '../../shared/services/dialog-reference';

enum StatusCondition {
  OPERATIONAL = 'operational',
  IN_MAINTENANCE = 'inMaintenance',
  BROKEN = 'broken',
}

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './device-form.component.html',
  styleUrl: './device-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceFormComponent {
  readonly StatusCondition = StatusCondition;
  dialogData: any = this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);

  readonly deviceForm = new FormGroup({
    deviceCode: new FormControl<string>('', Validators.required),
    deviceName: new FormControl<string>('', Validators.required),
    statusName: new FormControl<string>('', Validators.required),
    statusCondition: new FormControl<string>('operational', Validators.required),
  });

  constructor(
    private readonly store: Store,
    private readonly injector: Injector
  ) {}

  onSubmit() {
    const compositionId = this.dialogData.compositionId as number;
    const statusCondition = this.deviceForm.controls['statusCondition'].value;

    const device = {
      compositionId,
      deviceCode: this.deviceForm.controls['deviceCode'].value as string,
      deviceName: this.deviceForm.controls['deviceName'].value as string,
      statusName: this.deviceForm.controls['statusName'].value as string,
      operational: statusCondition === StatusCondition.OPERATIONAL,
      inMaintenance: statusCondition === StatusCondition.IN_MAINTENANCE,
      broken: statusCondition === StatusCondition.BROKEN,
    };

    this.store.dispatch(CompositionActions.createDevice({ device }));
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
