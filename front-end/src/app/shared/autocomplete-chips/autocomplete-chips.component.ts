import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  destroyedRef = inject(DestroyRef);
  @Input() required = false;
  @Input() itemsCtrl!: FormControl<string[]>;
  @Input() options$!: Observable<LabeledValue<number>[]>;
  options?: LabeledValue<number>[] = undefined;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Output() inputTextChanged = new EventEmitter<string>();
  @Output() chipsChanged = new EventEmitter<void>();
  private destroyRef = inject(DestroyRef);
  chips: LabeledValue<number>[] = [];

  @Input() textCtrl!: FormControl<string>;

  @ViewChild('textInput') textInput!: ElementRef;

  constructor(private readonly changeRef: ChangeDetectorRef) {}

  ngOnInit(): void {
      this.options$.pipe(takeUntilDestroyed(this.destroyedRef)).subscribe((options) => {
        this.options = options;
        this.changeRef.markForCheck();
      });
  }

  ngAfterViewInit() {
    fromEvent(this.textInput.nativeElement, 'input')
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((e) => {
      
        this.notifyAboutTextChange();
      });
  }

  remove(id: string): void {
    const numberId = Number(id);

    const found = this.chips.findIndex((el) => el.value === numberId);

    if (found !== -1) {
      this.chips.splice(found, 1);

      this.itemsCtrl.setValue(this.chips.map((el) => String(el.value)));
      this.chipsChanged.emit();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value as number;
    const label = event.option.viewValue as string;

    const found = this.chips.findIndex((el) => el.value === value);

    if (found === -1) {
      this.chips.push({ value, label });

      this.itemsCtrl.setValue(this.chips.map((el) => String(el.value)));
      this.chipsChanged.emit();

      if (this.required) {
        this.itemsCtrl.updateValueAndValidity();
      }
    }

    this.textInput.nativeElement.value = '';
  }

  getChipLabel(id: string): string {
    const numberId = Number(id);

    return this.chips.find((c) => c.value === numberId)?.label ?? 'Empty';
  }

  setChips(chips: LabeledValue<number>[]) {
    this.chips = chips;
    this.changeRef.markForCheck();
  }

  notifyAboutTextChange() {
    this.options = undefined;
    this.inputTextChanged.emit(this.textInput.nativeElement.value);
  }
}
