import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, take } from 'rxjs';
import { CompositionNameAutocompleteComponent } from '../../autocompletes/composition-name-autocomplete/composition-name-autocomplete.component';
import { MaterialModule } from '../../../material/material.module';
import { DIALOG_DATA } from '../../../shared/services/dialog.service';
import { DialogReference } from '../../../shared/services/dialog-reference';
import { CompositionsService } from '../../../../../generated-sources/openapi';
import { CompositionActions } from '../../../store/composition/composition.actions';

export interface LinkCompositionData {
  compositionId: number;
  locationNames: string[];
  excludedCompositionCodes: string[];
}

export interface LabeledValue<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-link-composition-form',
  standalone: true,
  imports: [CommonModule, CompositionNameAutocompleteComponent, MaterialModule],
  templateUrl: './link-composition-form.component.html',
  styleUrl: './link-composition-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCompositionFormComponent {
  dialogData: LinkCompositionData = this.injector.get(DIALOG_DATA);
  dialogRef: DialogReference = this.injector.get(DialogReference);
  compositionTypes$: BehaviorSubject<LabeledValue<number>[]> =
    new BehaviorSubject<LabeledValue<number>[]>([]);
  options$ = this.compositionTypes$.asObservable();
  optionId?: number;

  constructor(
    private readonly store: Store,
    private readonly injector: Injector,
    private readonly service: CompositionsService
  ) {}

  onUserInput(text: string) {
    const { locationNames, excludedCompositionCodes } = this.dialogData;
    this.service
      .readCompositions({
        locationNames,
        excludedCompositionCodes,
        code: text,
      })
      .pipe(
        map((compositions) =>
          compositions.map((c) => ({ label: c.code, value: c.id }))
        ),
        take(1)
      )
      .subscribe((data) => this.compositionTypes$.next(data));
  }

  setOption(option: number | undefined) {
    this.optionId = option;
  }

  linkCompositions() {
    if (this.optionId !== undefined) {
      this.store.dispatch(
        CompositionActions.linkCompositions({
          firstId: this.dialogData.compositionId,
          secondId: this.optionId,
        })
      );
    }

    this.dialogRef.close();
  }
}
