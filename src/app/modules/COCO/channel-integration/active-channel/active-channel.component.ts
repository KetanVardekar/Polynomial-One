import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { DeletePopUpComponent } from 'src/app/modules/common/delete-pop-up/delete-pop-up.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ISchannelIntegrationService } from 'src/app/modules/core/services/IS/ischannel-integration.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ViewChannelComponent } from '../view-channel/view-channel.component';
@Component({
  selector: 'app-active-channel',
  templateUrl: './active-channel.component.html',
  styleUrls: ['./active-channel.component.scss'],
})
export class ActiveChannelComponent implements OnInit, OnDestroy {
  @Input() activeChannelData: any;

  @Output() editChannel = new EventEmitter<any>();

  selectall: any;

  public unsubscribe = new Subject<any>();
  channelID: any;
  activeChannel: any;
  tabIndex: any;
  botType: any;
  id: any;
  channelId: any;

  constructor(
    private modalService: NgbModal,
    private toaster: ToastrService,
    private ngxService: NgxUiLoaderService,
    private ischannnelIntegrationService: ISchannelIntegrationService
  ) {}

  ngOnInit(): void {
    this.botType = localStorage.getItem("botType")
    this.fetchActiveChannels();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  
  fetchActiveChannels(): void{
    const payload = {
      botType: this.botType
    }
    this.ischannnelIntegrationService.fetchActiveChannels(payload).subscribe(
      data => {
        console.log("channel",data)
        this.activeChannelData = data.data
      },
      error => {
        console.log(error)
      }
    )
  }

  deleteChannel(deleteChannel: any) {
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'Are you sure you want To delete this active channel named';
    modalRef.componentInstance.selectedName = deleteChannel.channelType;
    modalRef.result.then((result) => {
      if (result) {
        this.ngxService.start();
        const payload = {
          channelType: deleteChannel.channelType,
          botType: this.botType
        };
        this.ischannnelIntegrationService
          .deleteChannel(payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toaster.success(data['message']);
                this.ngxService.stop();
              } else {
                this.toaster.error(data['message']);
                this.ngxService.stop();
              }
            },
            (error) => {
              this.toaster.error(error.error.message);
              this.ngxService.stop();
            }
          );
      }
    });
  }

  addOrDeleteMember(data: any, event: any) {
    if (event.target.checked == true) {
      data.checked = true;
    } else {
      data.checked = false;
    }
  }
  selectdeselectall(event: any) {
    if (event.target.checked == true) {
      this.selectall = true;
      this.activeChannelData.forEach((ele: any) => {
        ele['checked'] = true;
      });
    } else {
      this.selectall = false;
      this.activeChannelData.forEach((ele: any) => {
        ele['checked'] = false;
      });
    }
  }

  editactiveChannel() {
    this.editChannel.emit(true);
  }

  viewActiveChannel(viewChannel: any) {
    if (viewChannel) {
      const modalRef = this.modalService.open(ViewChannelComponent, {
        size: 'xl',
      });
      modalRef.componentInstance.channelId = viewChannel;
    }
  }
}
