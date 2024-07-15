import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, charLimit: number): string {
    if (!value) {
      return '';
    }

    if (value.length <= charLimit) {
      return value;
    }

    return value.slice(0, charLimit) + '...';
  }

}
