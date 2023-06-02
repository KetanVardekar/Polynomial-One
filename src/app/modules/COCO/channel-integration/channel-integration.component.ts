import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISchannelIntegrationService } from '../../core/services/IS/ischannel-integration.service';

@Component({
  selector: 'app-channel-integration',
  templateUrl: './channel-integration.component.html',
  styleUrls: ['./channel-integration.component.scss'],
})
export class ChannelIntegrationComponent implements OnInit, OnDestroy {
  createChannel: any = [];
  activeChannel: any = [];
  public tab: any = 'create';
  public unsubscribe = new Subject<any>();
  showConfigureChannelFlag: boolean = false;
  showEditFlag: boolean = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private toster: ToastrService,
    private ngxService: NgxUiLoaderService,
    private ischannnelIntegrationService: ISchannelIntegrationService
  ) {}

  ngOnInit(): void {
    this.getChannelIntegration();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  configure(event: any) {
    this.showConfigureChannelFlag = event;
    this.cdr.detectChanges();
  }

  editChannel(event: any) {
    this.showConfigureChannelFlag = event;
    this.showEditFlag = event;
    this.cdr.detectChanges();
  }

  getChannelIntegration() {
    this.ngxService.start();
    forkJoin([
      this.ischannnelIntegrationService.channelIntegration(), // create channel
      // this.ischannnelIntegrationService.activeChannelIntegration(), // active channel
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([response1, response2]: any) => {
          if (response1['status'] && response1.data && response1.data.length) {
            this.createChannel = response1.data;

            this.ngxService.stop();
          } else {
            this.toster.error(response1['message']);
            this.ngxService.stop();
          }
          this.ngxService.stop();
          // if (response2['status'] && response2.data && response2.data.length) {
          //   this.activeChannel = response2.data;
          //   this.ngxService.stop();
          // } else {
          //   this.toster.error(response1['message']);
          //   this.ngxService.stop();
          // }
        },
        (error) => {
          this.ngxService.stop();
          this.toster.error(error.error.message);
        }
      );
  }
}
