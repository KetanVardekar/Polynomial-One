import { AppService } from 'src/app/app.service';
import { EditIntentsComponent } from './edit-intents/edit-intents.component';
import { AddEditIntentsComponent } from './../add-edit-intents/add-edit-intents.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISIntentsService } from './../../core/services/IS/ISintents.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { DeletePopUpComponent } from '../../common/delete-pop-up/delete-pop-up.component';
import { AddSlotPopUpComponent } from './add-slot-pop-up/add-slot-pop-up.component';
import { BotService } from '../../core/services/bot.service';

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  styleUrls: ['./intents.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(
          ':enter',
          stagger(100, [
            animate(
              '.3s ease-out',
              keyframes([
                style({ opacity: 0, transform: 'translateY(60px)' }),
                style({ opacity: 1, transform: 'translateY(0)' }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class IntentsComponent implements OnInit, OnDestroy {

  @Output() setIntensName = new EventEmitter<any>();

  public unsubscribe: any = new Subject();
  serviceId: any;
  botType: any;
  botName: any;
  title: any;
  searchQuery: any = '';
  public tab: any = 'generic';
  editFlag: boolean = false;
  viewFlag: boolean = false;
  intentList :any = [];
  genericIntents: any = [];
  specificIntents: any = [];
  faqIntents: any = [];
  intentName:any = [];
  deploymentInfo: any;

  constructor(
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isIntentsService: ISIntentsService,
    private modalService: NgbModal,
    private appService: AppService,
    private botService: BotService
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    let deploymentInfo = localStorage.getItem("botDetails");
    this.deploymentInfo = deploymentInfo ? JSON.parse(deploymentInfo) : {}
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    this.getIntentList();

  }
  getIntentList() {
    // 0 - for all intents
    // 1 - Generic intents
    // 2 - Specific intents
    // 3 - FAQ intents
    this.ngxService.start();
    forkJoin([
      this.isIntentsService.getIntentList(
        1,
        this.searchQuery,
        this.botType,
        this.serviceId
      ), // Generic intents
      this.isIntentsService.getIntentList(
        2,
        this.searchQuery,
        this.botType,
        this.serviceId
      ), // Specific intents
      this.isIntentsService.getIntentList(
        3,
        this.searchQuery,
        this.botType,
        this.serviceId
      ), // FAQ intents
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([genericIntents, specificIntents, faqIntents]) => {
          this.genericIntents = genericIntents.data;
          this.specificIntents = specificIntents.data;
          this.faqIntents = faqIntents.data;
          this.ngxService.stop();
        },

        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }
  searchEntities() {
    forkJoin([
      this.isIntentsService.getIntentList(
        1,
        this.searchQuery,
        this.botType,
        this.serviceId
      ), // Generic intents
      this.isIntentsService.getIntentList(
        2,
        this.searchQuery,
        this.botType,
        this.serviceId
      ), // Specific intents
      this.isIntentsService.getIntentList(
        3,
        this.searchQuery,
        this.botType,
        this.serviceId
      ), // FAQ intents
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([genericIntents, specificIntents, faqIntents]) => {
          this.genericIntents = genericIntents.data;
          this.specificIntents = specificIntents.data;
          this.faqIntents = faqIntents.data;
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }

  trainAgent = () => {
    this.ngxService.start()
    this.botService.trainAgent(this.serviceId).subscribe(
      data=> {
        this.ngxService.stop()
      }
    )
  }

  addIntent() {
    const modalRef = this.modalService.open(AddEditIntentsComponent, {
      windowClass: 'modal-xl,modal-content',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.result.then((result) => {
      if (result) {
        this.getIntentList();
      }
    });
  }

  editIntent(intent: any) {
    this.intentName=intent.intentName
    this.editFlag = true;




    //   animation: true,
    //   backdrop: 'static',
    //   keyboard: false,
    // });

    // modalRef.componentInstance.editEntity = true;
    // modalRef.componentInstance.intent = intent;
    // modalRef.result.then((result) => {
    //   if (result) {
    //     this.getIntentList();
    //   }
    // });
  }
  viewIntent(intent:any){
    this.intentName=intent.intentName
    this.viewFlag = true;

    // this.intentList = intent ;


  }
  back() {
    this.editFlag=false;
    this.viewFlag = false;

  }
  intentsEmit(){
    this.editFlag = false;
    this.viewFlag = false;
  }

  deleteIntent(deleteIntentName: any) {
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'You want To delete this intent named';
    modalRef.componentInstance.selectedName = deleteIntentName.intentName
    modalRef.result.then((result) => {
      if (result) {
        this.ngxService.start();
        const payload = {
          intentName: deleteIntentName.intentName,
        };
        this.isIntentsService
          .deleteIntent(this.botType, this.serviceId, payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);
                this.getIntentList();
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
