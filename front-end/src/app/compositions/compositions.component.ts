import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-compositions',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './compositions.component.html',
  styleUrl: './compositions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionsComponent {}
