import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markentity'
})
export class MarkEntityPipe implements PipeTransform {

  transform(value: string,obj:any): any {

    let sentence = obj.name.split(" ");
    if(obj.mark.length>0){

      obj.mark.forEach((entity:any) => {

        let index = sentence.indexOf(entity.markEntityValue);
        if(index > -1){
          sentence[index] = `<span class="highlight" title="entity.markEntityName">${sentence[index]}</span>`;
        }
      });

    }
    return sentence.join(" ");
  }

}
