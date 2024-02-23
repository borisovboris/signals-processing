import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';
import { events } from '../../store/event/event.selectors';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from '../../material/material.module';
import { Router } from '@angular/router';
import { DialogService } from '../../shared/services/dialog.service';
import { EventFormComponent } from '../event-form/event-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, map, take } from 'rxjs';
import { LabeledValue } from '../../shared/autocomplete-chips/autocomplete.model';
import { AutocompleteChipsComponent } from '../../shared/autocomplete-chips/autocomplete-chips.component';
import {
  EventFiltersDTO,
  EventsService,
} from '../../../../generated-sources/openapi';
import moment from 'moment';

export enum ManualInsert {
  ANY = 'Any',
  MANUAL = 'Manual',
  NOT_MANUAL = 'Not manual',
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    ScrollingModule,
    CommonModule,
    MaterialModule,
    AutocompleteChipsComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent implements OnInit {
  ManualInsert = ManualInsert;
  typesCtrl = new FormControl<string[]>([], { nonNullable: true });
  typeCtrl = new FormControl<string>('', { nonNullable: true });
  types$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  typeOptions$ = this.types$.asObservable();

  manualInsertCtrl = new FormControl<ManualInsert>(ManualInsert.ANY, {
    nonNullable: true,
  });
  startDateCtrl = new FormControl<string | null>(null);
  endDateCtrl = new FormControl<string | null>(null);

  events$ = this.store.select(events);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly eventService: EventsService
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

  handleTypeInput(text: string) {
    const eventTypeIds = this.getEventTypeIds();

    this.eventService
      .readEventTypes({ name: text, exludedItemIds: eventTypeIds })
      .pipe(
        map((types) => types.map((c) => ({ label: c.name, value: c.id }))),
        take(1)
      )
      .subscribe((data) => this.types$.next(data));
  }

  handleTypeChipsChange() {
    this.getEvents();
  }

  clearDates() {
    this.startDateCtrl.reset();
    this.endDateCtrl.reset();
    this.getEvents();
  }

  clearDisabled() {
    return this.startDateCtrl.value === null && this.endDateCtrl.value === null;
  }

  getEventTypeIds() {
    return this.typesCtrl.value.map((t) => Number(t));
  }

  getEvents() {
    const eventTypeIds = this.getEventTypeIds();
    const startDate =
      this.startDateCtrl.value === null
        ? undefined
        : moment(this.startDateCtrl.value).format('DD-MM-YYYY');
    const endDate =
      this.endDateCtrl.value === null
        ? undefined
        : moment(this.endDateCtrl.value).format('DD-MM-YYYY');
    const manuallyInserted = this.checkIfManuallyInserted(
      this.manualInsertCtrl.value
    );

    const filters: EventFiltersDTO = {
      eventTypeIds,
      startDate,
      endDate,
      manuallyInserted,
    };

    this.store.dispatch(EventActions.getEvents(filters));
  }

  checkIfManuallyInserted(value: ManualInsert): boolean | undefined {
    switch (value) {
      case ManualInsert.MANUAL:
        return true;
      case ManualInsert.NOT_MANUAL:
        return false;
      default:
        return undefined;
    }
  }
}
