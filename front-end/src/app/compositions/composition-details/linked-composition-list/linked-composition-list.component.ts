import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/services/dialog.service';
import {
  CompositionDTO,
  CompositionDetailsDTO,
} from '../../../../../generated-sources/openapi';
import {
  LinkCompositionData,
  LinkCompositionFormComponent,
} from '../link-composition-form/link-composition-form.component';
import { CompositionActions } from '../../../store/composition/composition.actions';
import { fadeIn } from '../../../shared/animations';
import { NoDataComponent } from '../../../shared/no-data/no-data.component';

@Component({
  selector: 'app-linked-composition-list',
  standalone: true,
  animations: [fadeIn],
  imports: [MaterialModule, ScrollingModule, CommonModule, NoDataComponent],
  templateUrl: './linked-composition-list.component.html',
  styleUrl: './linked-composition-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkedCompositionListComponent {
  @Input() composition?: CompositionDTO;
  @Input() linkedCompositions?: CompositionDTO[];

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialogService: DialogService
  ) {}

  openLinkCompositionForm() {
    if (
      this.linkedCompositions === undefined ||
      this.composition === undefined
    ) {
      return;
    }

    let relatedCompositions = this.linkedCompositions.map((c) => c.id);
    let currentComposition = this.composition.id;

    const data: LinkCompositionData = {
      compositionId: currentComposition,
      cities: [this.composition.city.value],
      excludedCompositions: [currentComposition, ...relatedCompositions],
    };

    this.dialogService.open(LinkCompositionFormComponent, { data });
  }

  unlinkCompositions(linkedCompositionId: number) {
    if (this.composition !== undefined) {
      this.store.dispatch(
        CompositionActions.unlinkCompositions({
          firstId: this.composition.id,
          secondId: linkedCompositionId,
        })
      );
    }
  }
}
