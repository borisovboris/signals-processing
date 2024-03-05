import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import signalsSchema from './signals-schema.json';
import Ajv2019 from 'ajv/dist/2019';
import data from 'ajv/dist/refs/json-schema-draft-07.json';
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';
import { uploadingSignalsInProgress } from '../../store/event/event.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const ajv = new Ajv2019();
ajv.addMetaSchema(data);

@Component({
  selector: 'app-upload-signals',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './upload-signals.component.html',
  styleUrl: './upload-signals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadSignalsComponent implements OnInit {
  private readonly destroyedRef = inject(DestroyRef);
  loading = false;

  constructor(
    private readonly store: Store,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.store
      .select(uploadingSignalsInProgress)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe((loading) => {
        this.loading = loading;
        this.changeRef.markForCheck();
      });
  }

  onChange(files: FileList | null) {
    if (files === null) {
      return;
    }

    const file = files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(file);

    reader.onload = (e) => {
      let csv: string = reader.result as string;
      const parsed = JSON.parse(csv);
      const isValid = ajv.validate(signalsSchema, JSON.parse(csv));

      if (isValid) {
        const signals = parsed.signals;
        this.store.dispatch(EventActions.uploadSignals({ signals }));
      }
    };
  }
}
