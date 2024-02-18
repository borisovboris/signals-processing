import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';
import { events } from '../../store/event/event.selectors';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../material/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../shared/services/dialog.service';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [ScrollingModule, CommonModule, MaterialModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent implements OnInit {
  events$ = this.store.select(events);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService
  ) {}

  ngOnInit() {
    this.store.dispatch(EventActions.getEvents());
  }

  goToDetails(id: number) {
    this.router.navigate([`events`, id]);
  }

  openEventForm() {
    this.dialogService.open(EventFormComponent);
  }
}
