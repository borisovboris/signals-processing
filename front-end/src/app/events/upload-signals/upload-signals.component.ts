import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import signalsSchema from './signals-schema.json';
import Ajv2019 from "ajv/dist/2019"
import data from "ajv/dist/refs/json-schema-draft-07.json";
import { Store } from '@ngrx/store';
import { EventActions } from '../../store/event/event.actions';

const ajv = new Ajv2019();
ajv.addMetaSchema(data);

@Component({
  selector: 'app-upload-signals',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './upload-signals.component.html',
  styleUrl: './upload-signals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadSignalsComponent {

  constructor(private readonly store: Store) {

  }
  onChange(files: FileList | null) {
    if(files === null) {
      return;
    }

    const interested = files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(interested);

    reader.onload = (e) => {
       let csv: string = reader.result as string;
      const parsed = JSON.parse(csv);
      const isValid = ajv.validate(signalsSchema, JSON.parse(csv));

      if(isValid) {
        const signals = parsed.signals;
        console.log(JSON.stringify(signals));
        this.store.dispatch(EventActions.uploadSignals({ signals }));
      }
    }
  }
}
