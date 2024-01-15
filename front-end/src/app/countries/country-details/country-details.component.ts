import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryDetailsComponent {

}
