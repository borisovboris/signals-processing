import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { eventDetails } from '../../store/event/event.selectors';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NoDataComponent } from '../../shared/no-data/no-data.component';
import { fadeIn } from '../../shared/animations';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [MaterialModule, CommonModule, ScrollingModule, NoDataComponent],
  animations: [fadeIn],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetailsComponent implements OnInit {
  details$ = this.store.select(eventDetails);
  
  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
   const id = Number(this.route.snapshot.paramMap.get('id'));;

      this.store.dispatch(EventActions.getEventDetails({ id }));
  }

  goToDevice(id: number) {
    this.router.navigate(['compositions/device-details', id]);
  }
}
