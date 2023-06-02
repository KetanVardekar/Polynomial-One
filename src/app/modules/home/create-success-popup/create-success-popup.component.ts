import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-success-popup',
  templateUrl: './create-success-popup.component.html',
  styleUrls: ['./create-success-popup.component.scss'],
})
export class CreateSuccessPopupComponent implements OnInit {
  @Input() addAgent: any;
  userName: any;
  constructor(private activeModal: NgbActiveModal,
              private router : Router
 ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
  }
  close() {
    this.activeModal.close();
  }
  redirectToHome(){
    this.activeModal.close();
    window.location.reload();
  }
}
