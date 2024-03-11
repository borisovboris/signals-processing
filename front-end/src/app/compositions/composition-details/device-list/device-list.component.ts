import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../shared/services/dialog.service';
import { CompositionActions } from '../../../store/composition/composition.actions';
import { CreateEditDevice, DeviceFormComponent } from '../device-form/device-form.component';
import { DeviceDTO } from '../../../../../generated-sources/openapi';
import { MaterialModule } from '../../../material/material.module';
import { ListActionsComponent } from '../../../shared/list-actions/list-actions.component';
import { fadeIn } from '../../../shared/animations';
import { NoDataComponent } from '../../../shared/no-data/no-data.component';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [MaterialModule, ScrollingModule, CommonModule, ListActionsComponent, NoDataComponent],
  animations: [fadeIn],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceListComponent {
  @Input() compositionId?: number;
  @Input() devices?: DeviceDTO[];
  
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialogService: DialogService,
  ) {}
  
  deleteDevice(id: number) {
    this.store.dispatch(CompositionActions.deleteDevice({ id }));
  }

  goToDevice(id: number) {
    this.router.navigate(['compositions/device-details', id]);
  }

  openDeviceForm() {
    if (this.compositionId) {
      const data: CreateEditDevice = {
        compositionId: this.compositionId,
      };

      this.dialogService.open(DeviceFormComponent, {
        data,
      });
    }
  }

  openDeviceFormForEdit(device: DeviceDTO) {
    if (this.compositionId) {
      const data: CreateEditDevice = {
        compositionId: this.compositionId,
        editInfo: {
          status: {
            label: device.status.name,
            value: device.status.id,
          },
          deviceName: device.name,
          deviceCode: device.code,
          deviceId: device.id,
        },
      };

      this.dialogService.open(DeviceFormComponent, {
        data,
      });
    }
  }
}
