import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

export type DateType = 'table';

@Pipe({
  name: 'date',
  standalone: true
})
export class DatePipe implements PipeTransform {

  transform(value: string, type: DateType = 'table'): string {
    if(type === 'table') {
      return moment().format('ll');
    }

    return moment().format('ll');
  }

}
