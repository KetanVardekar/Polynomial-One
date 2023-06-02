import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-activesolution',
  templateUrl: './edit-activesolution.component.html',
  styleUrls: ['./edit-activesolution.component.scss'],
})
export class EditActivesolutionComponent implements OnInit {
  constructor(private activeModal: NgbActiveModal,
    private toastr:ToastrService) {}

  ngOnInit(): void {}
  close() {
    this.activeModal.close();
  }
  copyInputMessages(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toastr.info("Copied to clipboard");
  }
}
