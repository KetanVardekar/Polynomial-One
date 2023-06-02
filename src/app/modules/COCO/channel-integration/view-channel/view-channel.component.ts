import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISchannelIntegrationService } from 'src/app/modules/core/services/IS/ischannel-integration.service';

@Component({
  selector: 'app-view-channel',
  templateUrl: './view-channel.component.html',
  styleUrls: ['./view-channel.component.scss'],
})
export class ViewChannelComponent implements OnInit, OnDestroy {
  editFlag: boolean = true;
  public unsubscribe = new Subject<any>();
  @Input() channelId: any;

  viewAgenList: any = [];

  constructor(
    private activeModal: NgbActiveModal,
    private ischannnelIntegrationSevice: ISchannelIntegrationService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.channelId) {
      // this.viewActiveChannel();
    }
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toaster.info('copied to clipbord');
  }
  close() {
    this.activeModal.close();
  }
  // viewActiveChannel() {
  //   this.ngxService.start();
  //   this.ischannnelIntegrationSevice
  //     .fetchChannelData(this.channelId)
  //     .pipe(takeUntil(this.unsubscribe))
  //     .subscribe((res: any) => {
  //       if (res['status']) {
  //         this.viewAgenList = res['data'];
  //         this.ngxService.stop();
  //       } else {
  //         this.toaster.error(res['message']);
  //         this.ngxService.stop();
  //       }
  //     }),
  //     (error: any) => {
  //       this.ngxService.stop();
  //       this.toaster.error(error.error.message);
  //     };
  // }
}
