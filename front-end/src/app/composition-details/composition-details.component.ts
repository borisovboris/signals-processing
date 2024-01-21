import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../store/composition/composition.actions';
import { details } from '../store/composition/composition.selectors';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DialogService } from '../shared/services/dialog.service';
import { DeviceFormComponent } from './device-form/device-form.component';
import { isDefined } from '../shared/utils';

@Component({
  selector: 'app-composition-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, ScrollingModule],
  templateUrl: './composition-details.component.html',
  styleUrl: './composition-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionDetailsComponent implements OnInit {
  details$ = this.store.select(details);
  compositionId?: number;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit() {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.compositionId = params['id'];

      if (isDefined(this.compositionId)) {
        this.store.dispatch(
          CompositionActions.getDetails({ id: this.compositionId })
        );
      }
    });
  }

  openDeviceForm() {
    this.dialogService.open(DeviceFormComponent, {
      data: { compositionId: this.compositionId },
    });
  }
}
