import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-about-solution',
  templateUrl: './about-solution.component.html',
  styleUrls: ['./about-solution.component.scss'],
})
export class AboutSolutionComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
  close() {
    this.activeModal.close();
  }
}
