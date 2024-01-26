import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Observable, debounceTime, filter, of, tap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { isDefined } from '../../../shared/utils';
import { LabeledValue } from '../../../composition-details/link-composition-form/link-composition-form.component';

@Component({
  selector: 'app-composition-name-autocomplete',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './composition-name-autocomplete.component.html',
  styleUrl: './composition-name-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompositionNameAutocompleteComponent {
  private destroyRef = inject(DestroyRef);
  nameCtrl = new FormControl('');
  
  @Input() 
  options$!: Observable<LabeledValue<number>[]>;
  @Output()
  optionChanged = new EventEmitter<number | undefined>;
  @Output() 
  userTextInput = new EventEmitter<string>();

  ngOnInit() {
    this.userTextInput.emit('');

    this.nameCtrl.valueChanges
      .pipe(
        // Remove option whenever the user types in
        tap(() => this.optionChanged.emit(undefined)),
        debounceTime(300),
        filter((input) => isDefined(input) && input.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(text => this.userTextInput.emit(text!));
  }

  selectOption(event: MatAutocompleteSelectedEvent) {
    const labeledValue: LabeledValue<number> = event.option.value;
    this.optionChanged.emit(labeledValue.value);
  }

  displayFn(data: LabeledValue<number>): string {
    return data.label;
  }
}
