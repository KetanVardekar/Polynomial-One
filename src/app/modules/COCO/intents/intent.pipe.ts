import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'texttransform'})
export class TextTransformPipe implements PipeTransform {
  transform(value: string): string {
    const splitBy = '.'
    const splittedText = value.split( splitBy )[2];
    return `${splittedText}`
  }
}