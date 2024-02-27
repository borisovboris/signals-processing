import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import { CompositionDetailsDTO } from '../../../../../generated-sources/openapi';
import {
  LinkCompositionData,
  LinkCompositionFormComponent,
} from '../link-composition-form/link-composition-form.component';
import { CompositionActions } from '../../../store/composition/composition.actions';

@Component({
  selector: 'app-linked-composition-list',
  standalone: true,
  imports: [MaterialModule, ScrollingModule, CommonModule],
  templateUrl: './linked-composition-list.component.html',
  styleUrl: './linked-composition-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedCompositionListComponent {
  @Input() compositionId?: number;
  @Input() details?: CompositionDetailsDTO;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialogService: DialogService
  ) {}

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
}
