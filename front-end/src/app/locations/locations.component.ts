import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsComponent {

}
