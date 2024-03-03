import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeIn, fadeOut } from '../animations';

@Component({
  selector: 'app-no-data',
  standalone: true,
  imports: [],
  animations: [fadeIn, fadeOut],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataComponent {
 readonly EMPTY_FOLDER = '../../assets/no-results.png';
}
