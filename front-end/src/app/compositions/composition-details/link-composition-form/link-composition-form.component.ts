import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, take } from 'rxjs';
import { SingleAutocompleteComponent } from '../../../shared/single-autocomplete/single-autocomplete.component';
import { MaterialModule } from '../../../material/material.module';
import { DIALOG_DATA } from '../../../shared/services/dialog.service';
import { DialogReference } from '../../../shared/services/dialog-reference';
import {
  CompositionDTO,
  CompositionsService,
} from '../../../../../generated-sources/openapi';
import { CompositionActions } from '../../../store/composition/composition.actions';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  LabeledValue,
  isNumericLabeledValue,
  labeledValueValidator,
} from '../../../shared/autocomplete-chips/autocomplete.model';

export interface LinkCompositionData {
  compositionId: number;
  cities: number[];
  excludedCompositions: number[];
}

@Component({
  selector: 'app-link-composition-form',
  standalone: true,
  imports: [
    CommonModule,
    SingleAutocompleteComponent,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
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
  nameCtrl: FormControl<LabeledValue<number> | string | null> = new FormControl(
    '',
    [labeledValueValidator]
  );

  form = new FormGroup({
    nameCtrl: this.nameCtrl,
  });

  constructor(
    private readonly store: Store,
    private readonly injector: Injector,
    private readonly service: CompositionsService
  ) {}

  onUserInput(text: string) {
    const { cities, excludedCompositions } = this.dialogData;
    this.service
      .readCompositions({
        cities,
        excludedCompositions,
        code: text,
      })
      .pipe(
        map((compositions) =>
          compositions.map((c) => this.getLabeledValueForComposition(c))
        ),
        take(1)
      )
      .subscribe((data) => this.compositionTypes$.next(data));
  }

  linkCompositions() {
    const compositionName = this.form.get('nameCtrl')?.value;

    if (isNumericLabeledValue(compositionName)) {
      this.store.dispatch(
        CompositionActions.linkCompositions({
          firstId: this.dialogData.compositionId,
          secondId: compositionName.value,
        })
      );
    }

    this.dialogRef.close();
  }

  getLabeledValueForComposition(composition: CompositionDTO): LabeledValue<number> {
    const label = `${composition.code} (${composition.location.label})`;

    return { label, value: composition.id };
  }
}
