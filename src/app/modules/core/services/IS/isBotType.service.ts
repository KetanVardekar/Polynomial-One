import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BotTypeService {

  constructor() { }

  private subject = new BehaviorSubject<any>({});
  public getType = this.subject.asObservable();
  
  update(value: any) {
    this.subject.next(value);
  }

}
