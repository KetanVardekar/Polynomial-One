import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HomeService } from 'src/app/modules/core/services/home.service';
import { ISchannelIntegrationService } from 'src/app/modules/core/services/IS/ischannel-integration.service';

@Component({
  selector: 'app-selected-channel',
  templateUrl: './selected-channel.component.html',
  styleUrls: ['./selected-channel.component.scss'],
})
export class SelectedChannelComponent implements OnInit, OnDestroy {
  editFlag: boolean = true;

  @Output() configure = new EventEmitter<any>();
  @Output() editChannel = new EventEmitter<any>();

  @Input() showEditFlag: any;
  @Input() edit: any;

  lensAgentList: Array<any> = [];
  _id: any;
  select: any;
  appname: any;
  apikey: any;
  servicename: any;
  agentname: any;
  lensId: any;
  agentlist: any;
  public unsubscribe = new Subject<any>();

  constructor(
    private ngxService: NgxUiLoaderService,
    private ischannnelIntegrationService: ISchannelIntegrationService,
    private toaster: ToastrService,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.lensId = localStorage.getItem('lensId');
    this.getAgentList();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  back() {
    this.configure.emit(false);
  }
  // createEditChannel() {
  //   if (this.showEditFlag) {
  //     this.ngxService.start();
  //     const payload = {
  //       appName: this.appname,
  //       key: this.apikey,
  //       serviceName: this.servicename,
  //       agent: this.agentname,
  //     };

  //     this.ischannnelIntegrationService
  //       .editChannel(payload)
  //       .pipe(takeUntil(this.unsubscribe))
  //       .subscribe(
  //         (data: any) => {
  //           if (data['status']) {
  //             this.toaster.success(data['message']);
  //             this.ngxService.stop();
  //           } else {
  //             this.toaster.error(data['message']);
  //             this.ngxService.stop();
  //           }
  //         },
  //         (error) => {
  //           this.toaster.error(error.error.message);
  //           this.ngxService.stop();
  //         }
  //       );
  //   } else {
  //     const payload = {
  //       appName: this.appname,
  //       key: this.apikey,
  //       serviceName: this.servicename,
  //       agent: this.agentname,
  //     };
  //     this.ngxService.start();
  //     this.ischannnelIntegrationService
  //       .createChannel(payload)
  //       .pipe(takeUntil(this.unsubscribe))
  //       .subscribe(
  //         (res: any) => {
  //           if (res['status']) {
  //             this.toaster.success(res['message']);
  //             this.ngxService.stop();
  //           } else {
  //             this.toaster.error(res['message']);
  //             this.ngxService.stop();
  //           }
  //         },
  //         (err: any) => {
  //           this.toaster.error(err.error.message);
  //           this.ngxService.stop();
  //         }
  //       );
  //   }
  // }
  getAgentList() {
    this.ngxService.start();
    this.homeService
      .listAgents(this.lensId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        if (res['status']) {
          this.lensAgentList = res['data']['agents'];
          this.ngxService.stop();
        } else {
          this.toaster.error(res['message']);
          this.ngxService.stop();
        }
        this.ngxService.stop();
      }),
      (error: any) => {
        this.ngxService.stop();
        this.toaster.error(error.error.message);
      };
  }

  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
