import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ISIntentsService } from 'src/app/modules/core/services/IS/ISintents.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-intents',
  templateUrl: './view-intents.component.html',
  styleUrls: ['./view-intents.component.scss']
})
export class ViewIntentsComponent implements OnInit {
  public unsubscribe: any = new Subject();
  intentText: any = []
  intentsName :any ;
  botType:any;
  serviceId:any;

  @Input() setIntentsName :any

  constructor(
    // private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isIntentsService: ISIntentsService,
    ) {}

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
    this.setEditDetails();
  }
  setEditDetails() {
    this.ngxService.start();
    // this.intentName = this.intent.intentName;
    const payload = {
      intentName: this.setIntentsName,
    };
    this.isIntentsService
      .fetchIntentData(this.botType, this.serviceId, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            data.data.filter((x:any)=>{
              this.intentText = x.trainingPhrases
            })
            this.ngxService.stop();
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

}
