import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ready-to-publish',
  templateUrl: './ready-to-publish.component.html',
  styleUrls: ['./ready-to-publish.component.scss'],
})
export class ReadyToPublishComponent implements OnInit {
  @Input() readyToPublishData: any;

  selectAll: any
  checkAllIntents: boolean = false; //checkbox to select all valid intents for publish
  totalValidIntents: number = 0; //total (valid) publishable intents
  totalSelectedIntents: number = 0; //total intents where checkbox is selected

  constructor() { }

  ngOnInit(): void {}


  selectDeselctAll(event: any) {

    if (event.target.checked == true) {
      this.selectAll = true;
      this.readyToPublishData.forEach((ele: any) => {
        ele['checked'] = true;

      });
    } else {
      this.selectAll = false;
      this.readyToPublishData.forEach((ele: any) => {
        ele['checked'] = false;
      });
    }
  }

  checkUncheck(data: any, event: any) {
    if (event.target.checked == true) {
      data.checked = true;
    } else {
      data.checked = false;
    }
    let valid = true;
    this.readyToPublishData.forEach((ele: any) => {
      if (ele.checked == false) {
        valid = false;
      }
    });
    valid ? (this.selectAll = true) : (this.selectAll = false);
  }

}
