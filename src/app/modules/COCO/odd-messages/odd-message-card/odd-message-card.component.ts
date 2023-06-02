import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-odd-message-card',
  templateUrl: './odd-message-card.component.html',
  styleUrls: ['./odd-message-card.component.scss']
})
export class OddMessageCardComponent implements OnInit {

  serviceId:any;
  botType:any;
  @Input() oddMessagesArray: any=[];
  @Input() convIndex: any;

  @Output() onRemoveOddMsg = new EventEmitter<any>();
  @Output() onRemoveOddMsgs = new EventEmitter<any>();
  @Output() onEditOddMsgs = new EventEmitter<any>();

  constructor() { }


  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
  }

  //Remove single message from card from preview
  removeOddMsg = (i: number) => {
    const obj = {
      i: i,
      j: this.convIndex
    }
    this.onRemoveOddMsg.emit(obj);
  }

  //Remove randome/odd messages card from preview
  removeOddMsgs = () => {
    this.onRemoveOddMsgs.emit(this.convIndex);
  }

  editOddMsgs = () => {
    this.onEditOddMsgs.emit(this.convIndex);
  }

}
