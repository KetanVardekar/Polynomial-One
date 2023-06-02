import { Component, Input, OnInit } from '@angular/core';
import { constants } from 'fs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  // @Input() notificationList:any
  public unsubscribe: Subject<any> = new Subject();
  notificationList: any = [];
  newUpdateNotification:any = [];


  constructor(
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private appService: AppService,

  ) {
    // Observable.interval(2000).subscribe((x: any) => { // will execute every 30 seconds
    //   this.getFetchNotification();
    // });
  }

  ngOnInit(): void {
    this.getFetchNotification();
 }
  getFetchNotification() {
    this.notificationService
      .fetchNotification()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data: any) => {
          if (data['status']) {
            this.notificationList = data['data'];
            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error: any) => {
          this.toastr.error(error.error['message']);
          this.ngxService.stop();
        }
      );
  }


}
