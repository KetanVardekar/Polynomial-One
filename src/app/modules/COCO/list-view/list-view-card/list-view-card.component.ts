import { ISResponseLibraryService } from './../../../core/services/IS/ISresponseLibrary.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-view-card',
  templateUrl: './list-view-card.component.html',
  styleUrls: ['./list-view-card.component.scss']
})
export class ListViewCardComponent implements OnInit {

  listView: any;
  @Input() set data(dataObj: any) {
    //if data is not empty then populate form with it
    this.listView = dataObj;
    console.log(this.listView);
  }
  @Input() convIndex: any;
  serviceId: any;
  botType: any;

  constructor(
    private isResponseLibraryService: ISResponseLibraryService
  ) { }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
  }

  remove = (e:any) => {
    console.log(this.convIndex);
    this.isResponseLibraryService.removeResp({ action: "REMOVE", convIndex: this.convIndex });
    e.stopPropagation();
  }

  edit = (e:any) => {
    this.isResponseLibraryService.editResp({ action: "EDIT", convIndex: this.convIndex, payload: { type: "List View Card", response: this.listView } });
    e.stopPropagation();
  }

}
