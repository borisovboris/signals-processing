import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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

export function stringsLike(first: any, second: any): boolean {
  if (typeof first !== 'string' || typeof second !== 'string') {
    return false;
  }

  return (first as string).toLowerCase() === (second as string).toLowerCase();
}
