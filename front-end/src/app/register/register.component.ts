import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fadeIn } from '../shared/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  animations: [fadeIn],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

}
