import { ISEntitiesService } from './../../../core/services/IS/ISEntities.service';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgModuleRef,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeletePopUpComponent } from 'src/app/modules/common/delete-pop-up/delete-pop-up.component';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-custom-entities',
  templateUrl: './custom-entities.component.html',
  styleUrls: ['./custom-entities.component.scss'],
})
export class CustomEntitiesComponent implements OnInit, OnDestroy {
  @Output() editEntities = new EventEmitter<any>();
  @Output() viewEntities = new EventEmitter<any>();
  @Output() setEntityName = new EventEmitter<any>();
  @Input() customEntitiesData: any;
  public tab: any = 'custom';
  botName: any;
  serviceId: any;
  botType: any;
  searchQuery: any;
  entityType: any;
  public unsubscribe = new Subject<any>();
  customEntities: any = [];
  entityName: any
  editFlag: boolean = false;
  selecctedEntities: any;

  constructor(
    private isEntitiesService: ISEntitiesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    this.getEntities();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getEntities() {
    this.ngxService.start();
    // get global entities
    this.isEntitiesService
      .listEntites('custom', this.searchQuery, this.botType, this.serviceId) // get custom entities

      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.customEntities = response['data'];
          this.customEntities.map((x: any) => ({
            ...x,
            entityType: 'global',
            agent: 'COCO',
          }));
          this.ngxService.stop();
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }



  viewEntity(entity: any) {
    this.setEntityName.emit(entity.entityName);
    this.viewEntities.emit(true);
    // const modalRef = this.modalService.open(AddEditEntitiesComponent, {
    //   windowClass: 'modal-xl,modal-content',
    //   animation: true,
    //   backdrop: 'static',
    //   keyboard: false,
    // });
    // modalRef.componentInstance.viewTitle = true;
    // modalRef.componentInstance.entity = entity;
    // this.ngxService.start();
    // const payload = {
    //   entityName: entity,
    // };
    // this.isEntitiesService
    //   .fetchEntityData(this.botType, this.serviceId,this.entityType, this.searchQuery, payload)
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe(
    //     (data) => {
    //       if (data['status']) {
    //         this.toastr.success(data['message']);
    //         this.getEntities();
    //       } else {
    //         this.toastr.error(data['message']);
    //         this.ngxService.stop();
    //       }
    //     },
    //     (error) => {
    //       this.toastr.error(error.error.message);
    //       this.ngxService.stop();
    //     }
    //   );

  }
  searchInputMessages() { }
  deleteEntity(deleteEntityName: any) {

    // this.modalService.open(DeletePopUpComponent, {initialState});
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'You want To delete this entity named  ';
    modalRef.componentInstance.selectedName = deleteEntityName.entityName;
    modalRef.result.then((result) => {
      if (result) {
        this.ngxService.start();
        // this.getEntities();
        // this.entityName = this.customEntitiesData.entityName
        // this.entityName = this.customEntitiesData.entityName
        this.entityName = this.customEntitiesData.filter((x: any) => {
          return x.entityName === deleteEntityName.entityName ? x.entityName : ""
        })
        const payload = {
          entityName: this.entityName[0].entityName,
        };
        this.isEntitiesService
          .deleteEntity(this.botType, this.serviceId, payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);

                this.getEntities()
                window.location.reload()

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
  editEntity(event: any) {

    this.editEntities.emit(true);
    this.setEntityName.emit(event.entityName);
  }
}
