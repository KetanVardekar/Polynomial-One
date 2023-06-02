import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { ISEntitiesService } from 'src/app/modules/core/services/IS/ISEntities.service';
import { UploadFilePopUpComponent } from '../../upload-file-pop-up/upload-file-pop-up.component';


@Component({
  selector: 'app-edit-entities',
  templateUrl: './edit-entities.component.html',
  styleUrls: ['./edit-entities.component.scss'],
  animations: [
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
export class EditEntitiesComponent implements OnInit {
  @Input() selectedEntityName: any;
  @Input() customEntitiesData: any;
  @Output() entityEmit = new EventEmitter<any>();
  entitiesArray: Array<any> = [];
  entityArrayLength: any
  synonym: any;
  showBack:boolean=false
  showScroll: boolean = false;
  addIcon: boolean = false
  entityName: any;
  entityDetails: any = {
    entityValue: "",
    synonymText: ""
  };
  activeModal: any;
  public unsubscribe = new Subject<any>();
  botType: any;
  searchQuery: any;
  serviceId: any;
  entityType: any;

  constructor(
    private isEntitiesService: ISEntitiesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private modalService: NgbModal,
    private appService :AppService
  ) { }

  ngOnInit(): void {

    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
    this.fetchEntityData();
  }


  updateEntity() {


    if (this.entitiesArray && this, this.entitiesArray.length) {
      this.ngxService.start();
      this.entitiesArray.forEach(object => {
        delete object['add'];
      });
      const Payload: any = {
        entityName: this.selectedEntityName,
        entityTypeId: 1,
        entityValues: this.entitiesArray
      };
      this.isEntitiesService
        .updateEntity(this.botType, this.serviceId, Payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data: any) => {
            if (data['status']) {
              this.toastr.success(data['message']);
              this.entityEmit.emit(true);
              this.ngxService.stop()
            } else {
              this.toastr.error(data['message']);
              this.ngxService.stop()
            };
          },
          (error: any) => {
            this.toastr.error(error.error['message']);
            this.ngxService.stop();
          }
        );
    } else {
      this.toastr.error('Please Add Entity Name');
    }
  }


  fetchEntityData() {
    const payload: any = {
      entityName: this.selectedEntityName
    };
    this.ngxService.start();
    this.isEntitiesService
      .fetchEntityData(this.botType, 'custom', '', this.serviceId, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (res) => {
          if (res['status']) {
            res.data.filter((x: any) => {
              this.entitiesArray = x.entities
              this.entitiesArray.find((ele) => {
                if (ele.synonyms.length === 0) {
                  this.addIcon = true
                }
              })
            })
            this.entitiesArray.forEach((ele: any) => {
              ele.addbtn = false
            })
            console.log(this.entitiesArray)
            this.setEntityType(res.data[0].entityTypeId);
            this.ngxService.stop();
          } else {
            this.toastr.error(res['message']);
            this.ngxService.stop();
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
          this.ngxService.stop();
        }
      );

  }

  setEntityType(id: any) {
    switch (id) {
      case 1:
        this.entityType = 'Synonym Entity';
        break;
      case 2:
        this.entityType = 'Regex Entity';
        break;
      case 3:
        this.entityType = 'List Entity';
        break;
    }
  }

  deleteEntity(e: any, j: number) {
    e.stopPropagation();
    this.entitiesArray.splice(j, 1);
    this.showBack=true
    this.appService.setBackEvent(this.showBack)
  }

  redirectToUploadJSON() {
    const modalRef = this.modalService.open(UploadFilePopUpComponent, {
      windowClass: 'modal-xl,modal-content',
    });
    modalRef.componentInstance.entityName = this.selectedEntityName;
    modalRef.result.then((result: any) => {
      if (result) {
      }
    });
  }
  uploadImage(event: any) { }
  close() {
    this.activeModal.close();
  }


  cancel(e: any, i: number, j: number) {
    this.showBack=true
    this.appService.setBackEvent(this.showBack);
    this.entitiesArray[i].synonyms.splice(j, 1);
    e.stopPropagation();
    this.entityArrayLength = this.entitiesArray[i].synonyms.length
    if (this.entityArrayLength == 0) {
      this.addIcon = true
    }
  }

  addEntity(data: any) {
    this.showBack=true
    this.appService.setBackEvent(this.showBack);
    if (this.entityDetails.entityValue) {
      let entity = {
        displayName: this.entityDetails.entityValue,
        synonyms: [],
      };
      this.entitiesArray.unshift(entity);
      this.entityDetails.entityValue = '';
     this.entitiesArray.filter((ele:any)=>{

      // console.log(ele.synonyms.length)
      // console.log(ele.addbtn)
      if(ele.synonyms.length==0){
        this.addIcon=true
      }else{
        this.addIcon=false
      }
     })


    } else {
      this.toastr.error("Please add entity value")
    }
    // this.toastr.info("Please click on Update Before Going Back");
  }
  removeSynonym(event: any) {
    this.entitiesArray[event].synonyms.splice(event, 1);
  }
  addSynonym(e: any, i: number, data: any) {
    this.showBack=true
    this.appService.setBackEvent(this.showBack);
    e.stopPropagation();
    if (this.entityDetails.synonymText.length == 0) {
      this.toastr.error('Please add a synonym');
      return
    } else {
      if (
        this.entityDetails.synonymText.trim() &&
        this.entityDetails.synonymText.trim() != '' &&
        this.entitiesArray[i].synonyms.indexOf(this.entityDetails.synonymText) == -1
      ) {
        this.entitiesArray[i].synonyms.push(this.entityDetails.synonymText);
        this.entityDetails.synonymText = '';
        this.entitiesArray[i].add = false;
      } else {
        this.toastr.error('synonym already exists');
      }
    }
  }
  closeSynonym(event: any, i: number) {

    this.entitiesArray[i].add = false; //remove field 'add' from object
    this.entityDetails.synonymText = '';
    console.log(this.entitiesArray)
    // if (this.entitiesArray == 0) {
    //   this.addIcon = true
    // }
    this.entitiesArray.find((ele) => {
      // console.log(ele.synonyms.length)
      if (ele.synonyms.length == 0) {
        this.addIcon = true
      } else {
        this.addIcon = false
      }
    })
    event.stopPropagation();
  }

  //At a time only one entity can be edited
  addSyn(data: any) {
    this.addIcon = false
    this.entitiesArray.forEach((res) => {
      res.add = false
    })
    data.add = true
  }
}
