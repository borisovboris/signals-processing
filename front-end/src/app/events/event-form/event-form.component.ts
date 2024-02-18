import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventFormComponent {

}
