import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeletePopUpComponent } from 'src/app/modules/common/delete-pop-up/delete-pop-up.component';
import { ISIntegrationsService } from 'src/app/modules/core/services/IS/ISintegrations.service';
import { AddEditApiIntegrationsComponent } from '../../add-edit-api-integrations/add-edit-api-integrations.component';

@Component({
  selector: 'app-available-api',
  templateUrl: './available-api.component.html',
  styleUrls: ['./available-api.component.scss'],
})
export class AvailableApiComponent implements OnInit, OnDestroy {
  @Input() availableApiData: any;
  public unsubscribe = new Subject<any>();
  public tab: any = 'available';
  botName: any;
  apiList: any = [];
  serviceId: any;
  botType: any;
  searchQuery: any = "";

  constructor(
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private isIntegrationService: ISIntegrationsService
  ) {}

  ngOnInit(): void {
    this.botName = localStorage.getItem('botName');
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  getApiList() {
    this.ngxService.start();
    this.isIntegrationService
      .getAPIList(this.botType, this.searchQuery, this.serviceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.availableApiData = data['data'];
            this.cdr.detectChanges();
            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.errpr.message);
          this.ngxService.stop();
        }
      );
  }
  editAPI(apiDetails: any) {
    const modalRef = this.modalService.open(AddEditApiIntegrationsComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.editEntity = true;
    modalRef.componentInstance.editApiDetails = apiDetails;
    modalRef.result.then((result) => {
      if (result) {
        this.getApiList();
      }
    });
  }
  deleteIntegration(deleteAPIName: any) {
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'You want To delete this integration named';
    modalRef.componentInstance.selectedName = deleteAPIName
    modalRef.result.then((result) => {
      if (result) {
        this.ngxService.start();
        const payload = {
          apiName: deleteAPIName,
        };
        this.isIntegrationService
          .deleteApi(this.botType, this.serviceId, payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);
                this.getApiList();
              } else {
                this.toastr.error(data['message']);
                this.ngxService.stop();
              }
            },
            (error) => {
              this.toastr.error(error.error.message);
              this.ngxService.stop();
            }
          );
      }
    });
  }
}
