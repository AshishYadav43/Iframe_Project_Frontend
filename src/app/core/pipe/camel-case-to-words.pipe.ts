import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToWords',
  standalone: true 
})
export class CamelCaseToWordsPipe implements PipeTransform {

 transform(value: string | null | undefined): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');
  }
}
