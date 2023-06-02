import { ISResponseLibraryService } from './../../../core/services/IS/ISresponseLibrary.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-details-card',
  templateUrl: './property-details-card.component.html',
  styleUrls: ['./property-details-card.component.scss']
})
export class PropertyDetailsCardComponent implements OnInit {

  serviceId: any;
  botType: any;
  @Input() set data(dataObj: any) {
    //if data is not empty then populate form with it
    this.propertyCard = dataObj;
  }

  @Input() convIndex: any;
  locationTabOpen: boolean = false;
  propertyCard: any;
  slideConfig = {
    dots: true,
    arrows: false,
  };

  slideConfigPP = {
    dots: false,
    arrows: true,
  };
  constructor(private isResponseLibraryService:ISResponseLibraryService) { }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
  }

  changeLocationTab = (flag: boolean) => {
    this.locationTabOpen = flag;
  }

  remove = (e:any) => {
    console.log(this.convIndex);
    this.isResponseLibraryService.removeResp({ action: "REMOVE", convIndex: this.convIndex });
    e.stopPropagation();
  }

  edit = (e:any) => {
    this.isResponseLibraryService.editResp({ action: "EDIT", convIndex: this.convIndex, payload: { type: "Property View Card", response: this.propertyCard } });
    e.stopPropagation();
  }


}
