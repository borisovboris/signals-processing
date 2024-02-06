import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Observable, debounceTime, filter, of, tap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { isDefined } from '../../../shared/utils';
import { MatOption } from '@angular/material/core';
import { LabeledValue } from '../../composition-details/link-composition-form/link-composition-form.component';

@Component({
  selector: 'app-composition-name-autocomplete',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './composition-name-autocomplete.component.html',
  styleUrl: './composition-name-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositionNameAutocompleteComponent {
  private destroyRef = inject(DestroyRef);
  nameCtrl: FormControl<LabeledValue<number> | string | null> = new FormControl(
    ''
  );
  currentlySelectedOption!: MatOption<LabeledValue<number>>;

  @Input()
  options$!: Observable<LabeledValue<number>[]>;
  @Output()
  optionChanged = new EventEmitter<number | undefined>();
  @Output()
  userTextInput = new EventEmitter<string>();
  @ViewChild("auto") autocomplete!: MatAutocomplete;

  ngOnInit() {
    this.userTextInput.emit('');

    // valueChanges is triggered when the user types in and
    // also if an option from the autocomplete is selected.
    // The value of this field can be an object or a simple string.
    this.nameCtrl.valueChanges
      .pipe(
        tap((value) => {
          this.optionChanged.emit(undefined);
          
          // If an option was previously selected and the dropdown
          // is no longer open. Clear option on first text input removal.
          if(!this.autocomplete.isOpen) {
            this.clearOption();
          }
        }),
        debounceTime(300),
        filter((input) => isDefined(input)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        if (typeof value === 'string') {
          this.userTextInput.emit(value);
        }
      });
  }

  selectOption(event: MatAutocompleteSelectedEvent) {
    this.currentlySelectedOption = event.option;
    const labeledValue: LabeledValue<number> = event.option.value;
    this.optionChanged.emit(labeledValue.value);
  }

  displayFn(data: LabeledValue<number>): string {
    return data.label;
  }

  clearOption() {
    if (this.currentlySelectedOption) {
      this.currentlySelectedOption.deselect();
    }
  }
}
