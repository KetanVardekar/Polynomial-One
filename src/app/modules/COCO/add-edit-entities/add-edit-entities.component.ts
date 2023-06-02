import { ISEntitiesService } from './../../core/services/IS/ISEntities.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrganizationService } from '../../core/services/organization.service';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

@Component({
  selector: 'app-add-edit-entities',
  templateUrl: './add-edit-entities.component.html',
  styleUrls: ['./add-edit-entities.component.scss'],
})
export class AddEditEntitiesComponent implements OnInit, OnDestroy {
  @Input() editEntity: any;
  @Input() entity: any;
  public unsubscribe = new Subject<any>();
  entityName: any;
  entityType: any;
  synonyms: any = [];
  botType: any;
  serviceId: any;
  constructor(
    private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isEntitesService: ISEntitiesService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
    this.entity ? (this.entityName = this.entity.entityName) : '';
    if (this.editEntity) {
      this.setData();
    }
  }
  setData() {
    this.ngxService.start();

    const payload = {
      entityName: this.entityName,
    };
    this.isEntitesService
      .fetchEntityData(this.botType, 'custom', '', this.serviceId, payload)
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
  removeSynonym(index: any) {
    this.synonyms.splice(index, 1);
  }
  addEntities() {
    if(this.entityName && this.entityType){
    this.ngxService.start();
    const payload: any = {
      entityName: this.entityName,
      entityTypeId: Number(this.entityType),
    };
    this.isEntitesService
      .createEntity(payload, this.botType, this.serviceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response1: any) => {
          if (response1['status']) {
            this.toastr.success(response1['message']);
          this.activeModal.close('true');
          } else {
            this.toastr.error(response1['message']);
          }
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error['message']);
        }
      );
    }else{
      this.toastr.error('Please fill all the fields');
      return;
    }
  }

  close() {
    this.activeModal.close();
  }
}
