import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface AutoCompleteChips {
  onUserInput: (arg: string) => void;
  onItemsUpdated: (arg: string[]) => void;
}

export interface LabeledValue<T> {
  label: string;
  value: T;
}

export function isNumericLabeledValue(
  input: any
): input is LabeledValue<number> {
  return (
    input !== undefined &&
    typeof input.label === 'string' &&
    typeof input.value === 'number'
  );
}

export function labeledValueValidator(
  control: AbstractControl<any, any>
): ValidationErrors | null {
  if (isNumericLabeledValue(control.value)) {
    return null;
  }

  return { notAnOption: true };
}
