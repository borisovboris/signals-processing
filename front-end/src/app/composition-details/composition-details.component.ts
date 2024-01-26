import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../store/composition/composition.actions';
import { details } from '../store/composition/composition.selectors';
import { Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DialogService } from '../shared/services/dialog.service';
import { DeviceFormComponent } from './device-form/device-form.component';
import { isDefined } from '../shared/utils';
import { LinkCompositionData, LinkCompositionFormComponent } from './link-composition-form/link-composition-form.component';
import { CompositionDetailsDTO } from '../../../generated-sources/openapi';

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
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.compositionId = Number(params['id']);

      if (isDefined(this.compositionId)) {
        this.store.dispatch(
          CompositionActions.getDetails({ id: this.compositionId })
        );
      }
    });

    this.store.select(details).subscribe((details) => {
      this.details = details;
      this.changeRef.markForCheck();
    });
  }

  openDeviceForm() {
    this.dialogService.open(DeviceFormComponent, {
      data: { compositionId: this.compositionId },
    });
  }

  openLinkCompositionForm() {
    if(this.details === undefined || this.compositionId === undefined) {
      return;
    }

    let relatedCompositionCodes = this.details.relatedCompositions.map(c => c.code);
    let currentCompositionCode = this.details.composition.code;

    const data: LinkCompositionData = {
      compositionId: this.compositionId,
      locationNames: [this.details.composition.locationName],
      excludedCompositionCodes: [currentCompositionCode, ...relatedCompositionCodes],
    }

    this.dialogService.open(LinkCompositionFormComponent, { data });
  }
}
