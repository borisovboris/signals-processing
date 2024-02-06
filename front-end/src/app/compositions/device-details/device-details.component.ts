import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CompositionActions } from '../../store/composition/composition.actions';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [],
  templateUrl: './device-details.component.html',
  styleUrl: './device-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailsComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('deviceId'));

    this.store.dispatch(CompositionActions.getDeviceStatusTimeline({ id }));
  }
}
