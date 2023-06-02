import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-back-popup',
  templateUrl: './back-popup.component.html',
  styleUrls: ['./back-popup.component.scss']
})
export class BackPopupComponent implements OnInit {
  // @Input() configureEntities: any
  // @Input() viewEntities:any
  backEvent:any
  constructor(private activeModal: NgbActiveModal,
    private router: Router,
    private appService:AppService) { }

  ngOnInit(): void {

  }
  goBack(){

    window.location.reload();
    this.activeModal.close();
  }
  close(){
    this.activeModal.close();
  }
}
