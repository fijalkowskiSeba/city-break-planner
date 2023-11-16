import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToFirstComma'
})
export class StringToFirstCommaPipe implements PipeTransform {

  transform(value: string): string {
    return value.split(',')[0].trim();
  }

}
