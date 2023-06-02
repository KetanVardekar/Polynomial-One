import { ISIntentsService } from './../../../core/services/IS/ISintents.service';
import { takeUntil } from 'rxjs/operators';
import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFilePopUpComponent } from '../../upload-file-pop-up/upload-file-pop-up.component';
import { AddSlotPopUpComponent } from '../add-slot-pop-up/add-slot-pop-up.component';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-intents',
  templateUrl: './edit-intents.component.html',
  styleUrls: ['./edit-intents.component.scss'],

})
export class EditIntentsComponent implements OnInit {
  public unsubscribe: any = new Subject();
  slotSelected: Array<any> = [];
  @Output() intentsEmit = new EventEmitter<any>();
  @Input() editFlag: any;
  @Input() setIntentsName: any;
  intentsValue: any;
  intentText: any;
  traingPhrases: any = [];
  intentsArray: Array<any> = [];
  updatedIntentArray: Array<any> = [];
  deletePhrasesId: Array<any> = [];
  botType: any;
  serviceId: any;
  intent: any;
  editText: any;
  constructor(
    private modalService: NgbModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isIntentsService: ISIntentsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
    this.setEditDetails();
  }
  redirectToUploadJSON() {
    const modalRef = this.modalService.open(UploadFilePopUpComponent, {
      windowClass: 'modal-xl,modal-content',
    });
    modalRef.componentInstance.setIntentsName = this.setIntentsName;
    modalRef.result.then((result: any) => {
      if (result) {
        // this.getEntities();
      }
    });
  }
  UpdateIntent() {
    if (this.intentsArray && this.intentsArray.length) {
      this.ngxService.start();

      this.intentsArray.forEach((ele) => {
        this.traingPhrases.push(ele.name);
      });
      const payload = {
        intent: {
          intentName: this.setIntentsName,
          intentTypeId: 1,
          trainingPhrases: this.traingPhrases,
          addedSlots: this.slotSelected,
          deletePhrasesId: this.deletePhrasesId,
          updatedPhrases: this.updatedIntentArray,
        },
      };
      this.isIntentsService
        .updateIntent(this.botType, this.serviceId, payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data: any) => {
            if (data['status']) {
              const intentDetails = data['data'][0];
              this.intentText = intentDetails.trainingPhrases;

              this.intentText.forEach((element: any) => {

                this.intentsArray.push({ name: element.text, isEdit: false});

              });
              this.ngxService.stop();
              this.toastr.success(data['message']);
              this.intentsEmit.emit(true);
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
    } else {
      this.toastr.error('Please fill the training Phrases ');
    }
  }

  setEditDetails() {
    this.ngxService.start();
    const payload = {
      intentName: this.setIntentsName,
    };
    this.isIntentsService
      .fetchIntentData(this.botType, this.serviceId, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            const intentDetails = data['data'][0];
            this.intentText = intentDetails.trainingPhrases;
            this.intentText.map((p: any) => {
              this.intentsArray.push({ name: p.text, isEdit: false, id: p.id, mark : p.entitiesToMark });
            });
            this.slotSelected = intentDetails['addedSlots'];
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
  addSlot() {
    const modalRef = this.modalService.open(AddSlotPopUpComponent, {
      windowClass: 'modal-l,modal-content',
    });
    modalRef.componentInstance.selctedSlot = this.slotSelected;
    modalRef.result.then((result) => {
      if (result && result.length) {
        this.slotSelected = result;
      }
    });
  }

  //add intent training phrase
  addTraniningPhrases() {
    if (this.intentsValue) {
      this.intentsArray.unshift({ name: this.intentsValue, isEdit: false });
      // this.updatedIntentArray.unshift({name:this.intentsValue, isEdit:false})
      this.intentsValue = '';

    }
  }

  //Delete Training Phrases
  deleteTraniningPhrases(j: number) {
    //check if it is already exist then add id in delete phrases
    this.deletePhrasesId.push(this.intentsArray[j]['id']);
    //if it is newly added then remove it from new training phrases list
    this.intentsArray.splice(j, 1);
  }

  //edit training phrases
  editTrainingPhrases(i: any) {
   this.intentsArray.forEach((res)=>{
    res.isEdit=false
   })
    this.intentsArray[i].isEdit = true;
    this.editText = this.intentsArray[i].name;
    console.log(this.editText)


  }
  // this.entitiesArray.forEach((res)=>{
  //   res.add=false
  // })
  // data.add=true
  //   }

  //save edited training phrases
  saveTrainingPhrases(i: any) {
    if (this.editText) {
      this.intentsArray[i].isEdit = false;
      this.intentsArray[i].name = this.editText;
      console.log(this.intentsArray);
      this.intentsArray.forEach((ele) => {
        if (ele.add == true) {
          this.updatedIntentArray.push({ id: ele.id, text: ele.name });
          console.log(this.updatedIntentArray);
        }
      });
    }else{
      this.toastr.error("Please add training to continue.")
    }
  }
  //remove Slots from the list
  removeSlots(i: any) {
    this.slotSelected.splice(i, 1);
  }
}
