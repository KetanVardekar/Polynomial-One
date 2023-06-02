import { ISIntentsService } from './../../core/services/IS/ISintents.service';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-add-edit-intents',
  templateUrl: './add-edit-intents.component.html',
  styleUrls: ['./add-edit-intents.component.scss'],
})
export class AddEditIntentsComponent implements OnInit, OnDestroy {
  @Input() editEntity: any;
  @Input() intent: any;
  @Input() updateintent: any;

  public unsubscribe = new Subject<any>();
  intentName: any;
  intentType: any;
  phraseText: any;
  jsonFile: any;
  botType: any;
  serviceId: any;
  slotName: any;
  args: any;
  phrases: any = [];
  slotSelected: any = [];
  slotList: any = [];
  deletedPhrasesId: any = [];
  deletedSlotId: any = [];
  intentBaseQuestion: any = '';
  intentCategory: any = '';

  uploadJSONFlag: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isIntentsService: ISIntentsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
    // this.getSlotList();
    if (this.editEntity) {
      this.setEditDetails();
    }
  }
  setEditDetails() {
    this.ngxService.start();
    this.intentName = this.intent.intentName;
    const payload = {
      intentName: this.intentName,
    };
    this.isIntentsService
      .fetchIntentData(this.botType, this.serviceId, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
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



  addOrUpdateIntent() {
    if (this.intentName && this.intentType) {
      if (this.editEntity) {
        // this.updateIntent();
      } else {
        this.addIntent();
      }
    } else {
      this.toastr.error('Please enter intent name and type');
      return;
    }
  }
  addIntent() {
    this.ngxService.start();

    const payload: any = {
      intentName: this.intentName,
      intentTypeId: this.intentType,
    };
    // if(payload.intentTypeId == '1'){
    //   if(!payload.intentName.toLowerCase().includes("agent.generic")){
    //     payload.intentName = "agent.generic." + payload.intentName
    //   }
    // }
    if(payload.intentTypeId == '2'){
      if(!payload.intentName.toLowerCase().includes("agent.specific")){
        payload.intentName = "agent.specific." + payload.intentName
      }
    }
    if(this.intentType == '3'){
      if(!payload.intentName.toLowerCase().includes("agent.faq")){
        payload.intentName = "agent.faq." + this.intentCategory + "." + payload.intentName
      } else {
        payload.intentName = payload.intentName.split(".").slice(0,2).join(".") + "." + this.intentCategory + "." + this.intentName.split(".").slice(2).join("")
      }
    }
    this.isIntentsService
      .createIntent(this.botType, this.serviceId, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response1: any) => {
          if (response1['status']) {
            this.toastr.success(response1['message']);
            (this.slotSelected && this.slotSelected.length) ||
            (this.phrases && this.phrases.length)
              // ? this.updateIntent()
               this.activeModal.close('true');
            if(this.intentType == '3' && this.intentBaseQuestion.length > 0){
              const trainingPhraseUpdatePayload = {
                intent: {
                    intentName: payload.intentName,
                    intentTypeId: 1,
                    trainingPhrases: [
                        this.intentBaseQuestion
                    ],
                    addedSlots: [],
                    deletePhrasesId: [],
                    updatedPhrases: []
                }
              }
              this.isIntentsService
              .updateIntent(this.botType, this.serviceId, trainingPhraseUpdatePayload)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(
                (data: any) => {
                  if (data['status']) {
                    const intentDetails = data['data'][0];
                      this.ngxService.stop();
                    this.toastr.success(data['message']);
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
            this.ngxService.stop();
          } else {
            this.toastr.error(response1['message']);
          }
          this.ngxService.stop();
          this.close();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error['message']);
        }
      );
  }

    close() {
    this.activeModal.close();
  }
}
