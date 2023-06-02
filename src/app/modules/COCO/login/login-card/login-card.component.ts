import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss']
})
export class LoginCardComponent implements OnInit {

  serviceId:any;
  botType:any;
  @Output() onRemoveLoginCard = new EventEmitter<any>();
  @Output() onEditLoginCard = new EventEmitter<any>();
  @Input() loginCardData: any;
  @Input() convIndex: any;

  constructor() { }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
  }

  edit = () => {
    this.onEditLoginCard.emit(this.convIndex);
  }

  remove = () => {
    this.onRemoveLoginCard.emit(this.convIndex);
  }

}
