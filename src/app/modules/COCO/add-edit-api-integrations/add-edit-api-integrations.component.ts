import { ISIntegrationsService } from './../../core/services/IS/ISintegrations.service';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-api-integrations',
  templateUrl: './add-edit-api-integrations.component.html',
  styleUrls: ['./add-edit-api-integrations.component.scss'],
})
export class AddEditApiIntegrationsComponent implements OnInit, OnDestroy {
  @Input() editEntity: any;
  @Input() editApiDetails: any;
  public unsubscribe = new Subject<any>();
  apiDetails: any = {
    apiName: '',
    apiUrl: '',
    apiHeaders: '',
    description: '',
    isActive: true,
  };
  botType: any;
  serviceId: any;
  edit: boolean = true;
  formSubmitted:boolean =false
  constructor(
    private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isIntegrationService: ISIntegrationsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    if (this.editEntity) {
      this.setEditData();
    }
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
}

  setEditData() {
    this.editEntity ? (this.edit = true) : (this.edit = false);
    this.apiDetails.apiName = this.editApiDetails.apiDetails.apiName;
    this.apiDetails.apiUrl = this.editApiDetails.apiDetails.apiUrl;
    this.apiDetails.apiHeaders = this.editApiDetails.apiDetails.apiHeaders;
    this.apiDetails.description = this.editApiDetails.apiDetails.description;
    this.apiDetails.isActive = this.editApiDetails.isActive;

  }

  addOrUpdateAPI() {
    this.formSubmitted=true
    if(this.apiDetails.apiName>=65){
      return
    }
    if(this.apiDetails.description>=129){
      return
    }
    if (
      this.apiDetails.apiName &&
      this.apiDetails.apiUrl &&
      this.apiDetails.apiHeaders &&
      this.apiDetails.description
    ) {
      this.ngxService.start();
      const payload = {
        apiDetails: {
          apiName: this.apiDetails.apiName,
          apiUrl: this.apiDetails.apiUrl,
          apiHeaders: this.apiDetails.apiHeaders,
          description: this.apiDetails.description,
        },
        isActive: this.apiDetails.isActive,
      };
      if (this.editEntity) {
        this.isIntegrationService
          .updateApi(this.botType, this.serviceId, payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);
                this.formSubmitted=false
                this.activeModal.close('true');
                this.ngxService.stop();
              } else {
                this.toastr.error(data['message']);
                this.ngxService.stop();
              }
            },
            (error) => {
              this.toastr.error(error.error['message']);
              this.ngxService.stop();
            }
          );
      } else {
        this.isIntegrationService
          .addApi(this.botType, this.serviceId, payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);
                this.activeModal.close('true');
                this.ngxService.stop();
              } else {
                this.toastr.error(data['message']);
                this.ngxService.stop();
              }
            },
            (error) => {
              this.toastr.error(error.error['message']);
              this.ngxService.stop();
            }
          );
      }
    }
  }
  close() {
    this.activeModal.close();
  }
}
