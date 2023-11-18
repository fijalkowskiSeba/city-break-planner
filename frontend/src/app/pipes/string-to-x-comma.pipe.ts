import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToXComma'
})
export class StringToXCommaPipe implements PipeTransform {

  transform(value: string, x: number): string {
    const parts = value.split(',');
    if (x >= 0 && x < parts.length) {
      return parts.slice(0, x).join(',').trim();
    }
    return value;
  }

}
