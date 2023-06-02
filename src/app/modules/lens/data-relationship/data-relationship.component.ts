import { error } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { textChangeRangeIsUnchanged } from 'typescript';
import { LensBrainsService } from '../../core/services/lens/LensBrains.service';
import { LensDataRelationShipService } from '../../core/services/lens/LensDataRelationShip.service';
@Component({
  selector: 'app-data-relationship',
  templateUrl: './data-relationship.component.html',
  styleUrls: ['./data-relationship.component.scss'],
})
export class DataRelationshipComponent implements OnInit, OnDestroy {
  public unSubscribe = new Subject<any>();
  isEdit: any = false;

  brains: any[] = [];
  selectedBrainsList: any[] = [];
  dataRelation: any[] = [];

  head = [['Sr.No', 'Column', 'Brain', 'Brain ID']];

  data: any[] = [];
  serviceID: any;
  agentID: any;
  payload: any;
  brainName: any;
  AgentID: any;

  public downloadUrl: any;
  specializeList = new Map<string, boolean>();

  constructor(
    private sanitizer: DomSanitizer,
    private lensDataRelationshipService: LensDataRelationShipService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private lenseBrainService: LensBrainsService
  ) {}
  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  ngOnInit(): void {
    this.serviceID = localStorage.getItem('lensId');
    this.agentID = localStorage.getItem('agentID');
    this.getBrainsAndDataRelations();
    this.dataRelationTemplate();
  }

  getBrainsAndDataRelations() {
    this.ngxService.start();
    forkJoin([
      this.lensDataRelationshipService.dataRelations(
        this.agentID,
        this.serviceID
      ), // GEt Data Relation
      this.lenseBrainService.getBrains(this.serviceID), //Get selected Brains
    ])
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        ([dataRelation, brains]: any) => {
          this.dataRelation = dataRelation['data']['dataRelation'];
          this.dataRelation.forEach((element: any) => {
            element['isEdit'] = false;
          });
          this.brains = brains['data']['brains'];

          this.ngxService.stop();
          this.loadSelectedBrains();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  loadSelectedBrains() {
    this.ngxService.start();
    this.lenseBrainService
      .getAgentBrainSelected(this.serviceID, this.agentID)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            data['data']['brainSelected'].forEach((element: any) => {
              this.brains.forEach((all: any) => {
                this.specializeList.set(all._id, all.isSpecialized);

                if (all._id === element.id) {
                  this.selectedBrainsList.push(all);
                }
              });
            });
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

  dataRelationTemplate() {
    this.ngxService.start();
    this.lensDataRelationshipService
      .dataRelationtemplate(this.agentID, this.serviceID)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (res) => {
          if (res['status']) {
            var data = JSON.stringify(res['data']);
            var url = this.sanitizer.bypassSecurityTrustUrl(
              'data:text/json;charset=UTF-8,' + encodeURIComponent(data)
            );
            this.downloadUrl = url;
            this.ngxService.stop();
          } else {
            this.toastr.error(res['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }
  addEditDataRelation() {
    this.ngxService.start();
    let data = {
      dataRelation: this.dataRelation,
      agentID: this.agentID,
    };
    this.lensDataRelationshipService
      .addEditDataRelation(data)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (res) => {
          if (res['status']) {
            this.toastr.success(res['message']);
            this.ngxService.stop();
          } else {
            this.toastr.error(res['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }
  addColumn() {
    let data = {
      brainID: '',
      columnName: '',
    };
    this.dataRelation.push(data);
  }
  onEditClick(data: any) {
    data.isEdit = !data.isEdit;
  }

  onDelete(data: any) {
    let index = this.dataRelation.indexOf(data);
    this.dataRelation.splice(index, 1);
  }
}
