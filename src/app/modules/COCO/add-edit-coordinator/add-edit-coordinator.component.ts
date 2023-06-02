import { error } from 'console';
import { takeUntil } from 'rxjs/operators';
import { ISCoordinatorService } from './../../core/services/IS/IScoordinator.service';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-edit-coordinator',
  templateUrl: './add-edit-coordinator.component.html',
  styleUrls: ['./add-edit-coordinator.component.scss'],
})
export class AddEditCoordinatorComponent implements OnInit, OnDestroy {
  @Input() editEntity: any;
  @Input() intentName: any;
  @Input() apiName: any;
  @Input() apiList: any;

  public unsubscribe = new Subject<any>();
  apiDetails: any = {
    apiName: null,
    apiUrl: '',
    apiHeaders: '',
    description: '',
    isActive: true,
  };
  botType: any;
  serviceId: any;
  cIntentName: any;
  cApiName: any;
  constructor(
    private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isCoordinatorService: ISCoordinatorService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    console.log('bhhb', this.apiList);
    if (this.editEntity) {
      this.setEditData();
    }
    this.cIntentName = this.intentName;
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
  }
  setEditData() {
    this.cApiName = this.apiName;
  }

  close() {
    this.activeModal.close();
  }
  addOrUpdate() {
    if (this.cIntentName && this.cApiName) {
      this.ngxService.start();
      const payload = {
        intentName: this.cIntentName,
        apiName: this.cApiName,
      };
      this.isCoordinatorService
        .integrateIntentWithApi(this.botType, this.serviceId, payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['status']) {
              this.toastr.success(data['message']);
              this.activeModal.close();
              this.ngxService.stop();
            } else {
              this.toastr.error(data['message']);
              this.activeModal.close();
              this.ngxService.stop();
            }
          },
          (error) => {
            this.toastr.error(error.error.message);
            this.activeModal.close();
            this.ngxService.stop();
          }
        );
    } else {
      this.toastr.error('Please add an Api');
      this.ngxService.stop();
      return;
    }
  }
}
