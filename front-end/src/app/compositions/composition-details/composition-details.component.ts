import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../material/material.module';
import {
  CompositionDTO,
  CompositionDetailsDTO,
} from '../../../../generated-sources/openapi';
import {
  currentlyViewedComposition,
  currentlyViewedCompositionId,
  details,
} from '../../store/composition/composition.selectors';
import { DeviceListComponent } from './device-list/device-list.component';
import { LinkedCompositionListComponent } from './linked-composition-list/linked-composition-list.component';
import { filter, take } from 'rxjs';
import { fadeIn } from '../../shared/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  animations: [fadeIn],
  templateUrl: './composition-details.component.html',
  styleUrl: './composition-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionDetailsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  details?: CompositionDetailsDTO;
  currentComposition?: CompositionDTO;
  compositionId?: number;

  constructor(
    private readonly store: Store,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.store
      .select(currentlyViewedCompositionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => {
        this.compositionId = id;
        this.changeRef.markForCheck();
      });

    this.store
      .select(details)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((details) => {
        this.details = details;
        this.changeRef.markForCheck();
      });

    this.store
      .select(currentlyViewedComposition)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((composition) => {
        this.currentComposition = composition;
        this.changeRef.markForCheck();
      });
  }
}
