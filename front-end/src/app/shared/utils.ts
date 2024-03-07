import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { LabeledValue, isNumericLabeledValue } from './autocomplete-chips/autocomplete.model';
import { DeviceDTO } from '../../../generated-sources/openapi';

export type NULLABLE_STRING = string | null | undefined;

export function isDefined<T>(
  arg: T | null | undefined
): arg is T extends null | undefined ? never : T {
  return arg !== null && arg !== undefined;
}

// mat-input by default does not consider control errors until the the input
// is focused out. This error state matcher ensures that errors are immediately shown
// while the user is using the input.
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

// Fix this when null and undefined are provided
export function stringsLike(first: NULLABLE_STRING , second: NULLABLE_STRING): boolean {
  first = first ?? '';
  second = second ?? '';

  return first .toLowerCase() === second.toLowerCase();
}

export function getNullOrValue<T>(value: T | undefined): T | null {
  if (value === undefined) {
    return null;
  }

  return value;
}

export function getLabeledValue(
  input: LabeledValue<number> | string | null | undefined
): number | undefined {
  if (isNumericLabeledValue(input)) {
    return input.value;
  }

  return undefined;
}

export function createLabeledValueForDevice(device: DeviceDTO): LabeledValue<number> {
  const label = `${device.name} (${device.compositionCode})`;

  return { label, value: device.id };
}
