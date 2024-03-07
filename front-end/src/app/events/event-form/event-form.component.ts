import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import {
  LabeledValue,
  isNumericLabeledValue,
  labeledValueValidator,
} from '../../shared/autocomplete-chips/autocomplete.model';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, map, take } from 'rxjs';
import {
  CompositionsService,
  EventsService,
} from '../../../../generated-sources/openapi';
import { SingleAutocompleteComponent } from '../../shared/single-autocomplete/single-autocomplete.component';
import { AutocompleteChipsComponent } from '../../shared/autocomplete-chips/autocomplete-chips.component';
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';
import { DialogReference } from '../../shared/services/dialog-reference';
import { createLabeledValueForDevice, getLabeledValue } from '../../shared/utils';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    SingleAutocompleteComponent,
    AutocompleteChipsComponent,
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent {
  chipsRequiredValidator(): ValidatorFn {
    return (control) => {
      if (control.get('devicesCtrl')?.value.length === 0) {
        control.get('deviceTextCtrl')?.setErrors({ chipsRequired: true });
      } else {
        control.get('deviceTextCtrl')?.setErrors(null);
      }

      return null;
    };
  }

  eventTypeCtrl: FormControl<LabeledValue<number> | string | null> =
    new FormControl('', [labeledValueValidator]);
  types$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  typeOptions$ = this.types$.asObservable();

  devicesStatusCtrl: FormControl<LabeledValue<number> | string | null> =
    new FormControl('');
  deviceStatuses$: BehaviorSubject<LabeledValue<number>[]> =
    new BehaviorSubject<LabeledValue<number>[]>([]);
  deviceStatusesOptions$ = this.deviceStatuses$.asObservable();

  devicesCtrl = new FormControl<string[]>([], { nonNullable: true });
  devices$: BehaviorSubject<LabeledValue<number>[]> = new BehaviorSubject<
    LabeledValue<number>[]
  >([]);
  deviceOptions$ = this.devices$.asObservable();
  deviceTextCtrl = new FormControl<string>('', { nonNullable: true });

  eventForm = new FormGroup({
    eventTypeCtrl: this.eventTypeCtrl,
    nestedForm: new FormGroup(
      {
        devicesCtrl: this.devicesCtrl,
        deviceTextCtrl: this.deviceTextCtrl,
      },
      [this.chipsRequiredValidator().bind(this)]
    ),
    devicesStatusCtrl: this.devicesStatusCtrl,
  });

  constructor(
    private readonly eventsService: EventsService,
    private readonly compositionService: CompositionsService,
    private store: Store,
    private dialogRef: DialogReference
  ) {}

  onEventTypeInput(text: string) {
    this.eventsService
      .readEventTypes({ name: text })
      .pipe(
        map((types) => types.map((c) => ({ label: c.name, value: c.id }))),
        take(1)
      )
      .subscribe((data) => this.types$.next(data));
  }

  onDeviceStatusInput(text: string) {
    this.compositionService
      .readDeviceStatuses({ name: text })
      .pipe(take(1))
      .subscribe((data) => this.deviceStatuses$.next(data));
  }

  handleDeviceInput(text: string) {
    this.compositionService
      .readDevices({ name: text, exludedItemIds: this.selectedDevices })
      .pipe(
        take(1),
        map((devices) =>
          devices.map((device) => createLabeledValueForDevice(device))
        )
      )
      .subscribe((data) => this.devices$.next(data));
  }

  handleDeviceChipsChange() {
    this.devices$.next([]);
  }

  get selectedDevices() {
    return this.devicesCtrl.value.map((d) => Number(d));
  }

  get newDevicesStatus() {
    return this.devicesStatusCtrl.value;
  }

  createEvent() {
    const eventValue = this.eventTypeCtrl.value;

    if (isNumericLabeledValue(eventValue)) {
      const event = {
        eventTypeId: eventValue.value,
        deviceIds: this.selectedDevices,
        newDevicesStatusId: getLabeledValue(this.newDevicesStatus),
      };

      this.store.dispatch(EventActions.createEvent({ event }));

      this.dialogRef.close(true);
    }
  }
}
