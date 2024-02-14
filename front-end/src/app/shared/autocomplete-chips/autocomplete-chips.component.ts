import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  Observable,
  Subject,
  debounceTime,
  filter,
  takeUntil,
} from 'rxjs';
import { isDefined } from '../utils';

@Component({
  selector: 'app-autocomplete-chips',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './autocomplete-chips.component.html',
  styleUrl: './autocomplete-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteChipsComponent implements OnInit, OnDestroy {
  itemCtrl = new FormControl('');
  @Input() options$!: Observable<string[]>;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  destroy$ = new Subject<void>();
  @Input() chips: string[] = [];
  @Output() chipsChange = new EventEmitter<string[]>();
  @Output() userTextInput = new EventEmitter<string>();

  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;

  constructor(private readonly changeRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.itemCtrl.valueChanges
      .pipe(
        debounceTime(300),
        filter((input) => isDefined(input) && input.length > 0),
        takeUntil(this.destroy$)
      )
      .subscribe(text => this.userTextInput.emit(text!));
  }

  remove(item: string): void {
    const index = this.chips.indexOf(item);

    if (index >= 0) {
      this.chips.splice(index, 1);
      this.chipsChange.emit(this.chips.slice());
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const cityToAdd = event.option.viewValue;

    if (!this.chips.includes(cityToAdd)) {
      this.chips.push(cityToAdd);
      this.chipsChange.emit(this.chips.slice());
    }

    this.textInput.nativeElement.value = '';
    this.itemCtrl.setValue(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  setChips(chips: string[]) {
    this.chips = chips;
    this.changeRef.markForCheck();
  }
}
