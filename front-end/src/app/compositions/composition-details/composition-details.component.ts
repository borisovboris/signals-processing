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
import { DeviceListComponent } from './device-list/device-list.component';
import { LinkedCompositionListComponent } from './linked-composition-list/linked-composition-list.component';

@Component({
  selector: 'app-composition-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ScrollingModule,
    DeviceListComponent,
    LinkedCompositionListComponent,
  ],
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
}
