import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Observable, debounceTime, fromEvent } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { LabeledValue } from '../../compositions/composition-details/link-composition-form/link-composition-form.component';

@Component({
  selector: 'app-single-autocomplete',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './single-autocomplete.component.html',
  styleUrl: './single-autocomplete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleAutocompleteComponent {
  private destroyRef = inject(DestroyRef);
  @Input() ctrl!: FormControl<LabeledValue<number> | string | null>;
  currentlySelectedOption?: MatOption<LabeledValue<number>>;

  @Input()
  options$!: Observable<LabeledValue<number>[]>;
  @Output()
  optionChanged = new EventEmitter<number | undefined>();
  @Output()
  userTextInput = new EventEmitter<string>();
  @ViewChild('auto') autocomplete!: MatAutocomplete;
  @ViewChild('input') input!: ElementRef;

  ngOnInit() {
    this.userTextInput.emit('');
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'input')
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe((e: any) => {
        if (this.currentlySelectedOption) {
          this.clearOption();
        }

        const target = (e as Event).target as HTMLInputElement;
        const value = target.value;
        this.userTextInput.emit(value);
        this.optionChanged.emit(undefined);
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
      this.currentlySelectedOption.deselect(false);
      this.currentlySelectedOption = undefined;
    }
  }

  onClosed() {
    if (!this.currentlySelectedOption) {
      this.ctrl.setErrors({ notAnOption: true });
    } else {
      if (this.ctrl.hasError('notAnOption')) {
        delete this.ctrl.errors?.['notAnOption'];
        this.ctrl.updateValueAndValidity();
      }
    }
  }
}
