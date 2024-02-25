import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';
import { events } from '../../store/event/event.selectors';
import { CommonModule } from '@angular/common';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { MaterialModule } from '../../material/material.module';
import { Router } from '@angular/router';
import { DialogService } from '../../shared/services/dialog.service';
import { EventFormComponent } from '../event-form/event-form.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, filter, map, take } from 'rxjs';
import { LabeledValue } from '../../shared/autocomplete-chips/autocomplete.model';
import { AutocompleteChipsComponent } from '../../shared/autocomplete-chips/autocomplete-chips.component';
import {
  EventFiltersDTO,
  EventsService,
} from '../../../../generated-sources/openapi';
import moment from 'moment';
import { BatchList } from '../../shared/batch-list';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fadeIn } from '../../shared/animations';

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
  animations: [fadeIn],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent extends BatchList implements OnInit {
  destroyRef = inject(DestroyRef);
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

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

  form = new FormGroup({
    typesCtrl: this.typesCtrl,
    endDateCtrl: this.endDateCtrl,
    startDateCtrl: this.startDateCtrl,
    manualInsertCtrl: this.manualInsertCtrl,
  });

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialogService: DialogService,
    private readonly eventService: EventsService
  ) {
    super();
  }

  ngOnInit() {
    this.refetchEvents();
    this.scrolled$.pipe(debounceTime(300)).subscribe(() => this.getOffset());

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300))
      .subscribe(() => this.refetchEvents());
  }

  goToDetails(id: number) {
    this.router.navigate([`events`, id]);
  }

  openEventForm() {
    this.dialogService
      .open(EventFormComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter((created) => created === true)
      )
      .subscribe((_) => {
        this.offset = 0;
      });
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

  refetchEvents() {
    this.offset = 0;
    this.store.dispatch(EventActions.resetEvents());
    this.getEvents();
  }

  clearDates() {
    this.startDateCtrl.reset();
    this.endDateCtrl.reset();
  }

  clearDisabled() {
    return this.startDateCtrl.value === null && this.endDateCtrl.value === null;
  }

  getEventTypeIds() {
    return this.typesCtrl.value.map((t) => Number(t));
  }

  getNewBatch() {
    this.getEvents();
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
      offset: this.offset,
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
