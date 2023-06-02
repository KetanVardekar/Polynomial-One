import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-more-agents',
  templateUrl: './add-more-agents.component.html',
  styleUrls: ['./add-more-agents.component.scss']
})
export class AddMoreAgentsComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }
  close() {
    this.activeModal.close();
  }
  redirectToHome(){
    this.activeModal.close();
    window.location.reload();
  }
}
