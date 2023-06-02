import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-publish-history',
  templateUrl: './publish-history.component.html',
  styleUrls: ['./publish-history.component.scss'],
})
export class PublishHistoryComponent implements OnInit {
  @Input() publishHistoryData: any;

  constructor() {}

  ngOnInit(): void {}
  calculateDiff(dateSent:any){
    const currentDate = new Date();
    dateSent = new Date(dateSent);
     return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
   }
}
