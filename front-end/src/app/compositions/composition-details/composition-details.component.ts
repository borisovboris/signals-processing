import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  CreateEditDevice,
  DeviceFormComponent,
} from './device-form/device-form.component';
import {
  LinkCompositionData,
  LinkCompositionFormComponent,
} from './link-composition-form/link-composition-form.component';
import { MaterialModule } from '../../material/material.module';
import {
  CompositionDetailsDTO,
  DeviceDTO,
} from '../../../../generated-sources/openapi';
import { DialogService } from '../../shared/services/dialog.service';
import { isDefined } from '../../shared/utils';
import { CompositionActions } from '../../store/composition/composition.actions';
import { details } from '../../store/composition/composition.selectors';

@Component({
  selector: 'app-composition-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ScrollingModule],
  templateUrl: './composition-details.component.html',
  styleUrl: './composition-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionDetailsComponent implements OnInit {
  details?: CompositionDetailsDTO;
  compositionId?: number;

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.compositionId = Number(this.route.snapshot.paramMap.get('id'));

    if (isDefined(this.compositionId)) {
      this.store.dispatch(
        CompositionActions.getDetails({ id: this.compositionId })
      );
    }

    this.store.select(details).subscribe((details) => {
      this.details = details;
      this.changeRef.markForCheck();
    });
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

  openDeviceFormForEdit(event: Event, device: DeviceDTO) {
    event.stopPropagation();

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

  openLinkCompositionForm() {
    if (this.details === undefined || this.compositionId === undefined) {
      return;
    }

    let relatedCompositions = this.details.relatedCompositions.map((c) => c.id);
    let currentComposition = this.details.composition.id;

    const data: LinkCompositionData = {
      compositionId: this.compositionId,
      locations: [this.details.composition.locationId],
      excludedCompositions: [currentComposition, ...relatedCompositions],
    };

    this.dialogService.open(LinkCompositionFormComponent, { data });
  }

  unlinkCompositions(linkedCompositionId: number) {
    if (this.compositionId !== undefined) {
      this.store.dispatch(
        CompositionActions.unlinkCompositions({
          firstId: this.compositionId,
          secondId: linkedCompositionId,
        })
      );
    }
  }

  deleteDevice(event: Event, id: number) {
    event.stopPropagation();
    this.store.dispatch(CompositionActions.deleteDevice({ id }));
  }

  goToDevice(id: number) {
    this.router.navigate(['compositions/device-details', id]);
  }
}
