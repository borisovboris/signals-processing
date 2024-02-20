import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, debounceTime, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LabeledValue } from './autocomplete.model';

@Component({
  selector: 'app-autocomplete-chips',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './autocomplete-chips.component.html',
  styleUrl: './autocomplete-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteChipsComponent implements OnInit, AfterViewInit {
  @Input() required = false;
  @Input() itemsCtrl!: FormControl<string[]>;
  @Input() options$!: Observable<LabeledValue<number>[]>;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Output() inputTextChanged = new EventEmitter<string>();
  @Output() chipsChanged = new EventEmitter<void>();
  private destroyRef = inject(DestroyRef);
  chips: LabeledValue<number>[] = [];

  @Input() textCtrl!: FormControl<string>;

  @ViewChild('textInput') textInput!: ElementRef;

  ngOnInit() {
    this.inputTextChanged.emit('');
  }

  ngAfterViewInit() {
    fromEvent(this.textInput.nativeElement, 'input') .pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)).subscribe((e) => {
        const event = e as Event;
        const target = event.target as HTMLInputElement;

        this.inputTextChanged.emit(target.value);
      });
  }

  remove(id: string): void {
    const numberId = Number(id);

    const found = this.chips.findIndex(el => el.value === numberId);

    if (found !== -1) {
      this.chips.splice(found, 1);

      this.itemsCtrl.setValue(this.chips.map(el => String(el.value)));
      this.chipsChanged.emit();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value as number;
    const label = event.option.viewValue as string

    const found = this.chips.findIndex(el => el.value === value);

    if (found === -1) {
      this.chips.push({ value, label});
      
      this.itemsCtrl.setValue(this.chips.map(el => String(el.value)));
      this.chipsChanged.emit();

      if(this.required) {
        this.itemsCtrl.updateValueAndValidity();
      }
    }

    this.textInput.nativeElement.value = '';
  }

  getChipLabel(id: string): string {
    const numberId = Number(id);

      return this.chips.find(c => c.value === numberId)?.label ?? 'Empty';
  }

  getInputPlaceholder(): string {
    return this.itemsCtrl.value.length === 0 ? this.placeholder : '';
  }
}
