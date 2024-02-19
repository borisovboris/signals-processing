import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
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
import { Observable, debounceTime, fromEvent, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-autocomplete-chips',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './autocomplete-chips.component.html',
  styleUrl: './autocomplete-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteChipsComponent implements OnInit, AfterViewInit {
  @Input() itemsCtrl!: FormControl<string[]>;
  @Input() options$!: Observable<string[]>;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Output() inputTextChanged = new EventEmitter<string>();
  @Output() chipsChanged = new EventEmitter<void>();
  private destroyRef = inject(DestroyRef);

  @ViewChild('textInput') textInput!: ElementRef;

  constructor(private readonly changeRef: ChangeDetectorRef) {}

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

  get chips() {
    return this.itemsCtrl.value ?? [];
  }

  remove(item: string): void {
    const index = this.chips.indexOf(item);

    if (index >= 0) {
      const newChips = this.chips.slice();
      newChips.splice(index, 1);
      this.itemsCtrl.setValue(newChips);
      this.chipsChanged.emit();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const cityToAdd = event.option.viewValue;

    if (!this.chips.includes(cityToAdd)) {
      this.chips.push(cityToAdd);
      this.chipsChanged.emit();
    }

    this.textInput.nativeElement.value = '';
  }
}
