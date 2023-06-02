import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { ISEntitiesService } from '../../core/services/IS/ISEntities.service';

@Component({
  selector: 'app-delete-pop-up',
  templateUrl: './delete-pop-up.component.html',
  styleUrls: ['./delete-pop-up.component.scss'],
})
export class DeletePopUpComponent implements OnInit {

  @Input() title: any;
  @Input() selectedName:any;


  constructor(private activeModal: NgbActiveModal,
    ) {}

  ngOnInit(): void {

  }
  close() {
    this.activeModal.close();
  }
  submit() {
    this.activeModal.close('true');
  }

}
