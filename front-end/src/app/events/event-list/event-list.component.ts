import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';
import { events } from '../../store/event/event.selectors';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [ScrollingModule, CommonModule, MaterialModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListComponent implements OnInit{
  events$ = this.store.select(events);

  constructor(private readonly store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(EventActions.getEvents());
  }

}
