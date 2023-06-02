import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mysolution-colive',
  templateUrl: './mysolution-colive.component.html',
  styleUrls: ['./mysolution-colive.component.scss'],
})
export class MysolutionColiveComponent implements OnInit {
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
