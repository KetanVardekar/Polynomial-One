import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LensBrainsService } from '../../core/services/lens/LensBrains.service';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-brains',
  templateUrl: './brains.component.html',
  styleUrls: ['./brains.component.scss'],
  providers: [NgbAccordionConfig],
})
export class BrainsComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();

  activeId: string = "";
  serviceId: any;
  agentID: any;

  selectAll: any;
  brainData: any = [];

  brainList: any = [];
  brainDataList: any = [];
  longDescription: any = '';
  header: any = '';

  constructor(
    private lensBrainService: LensBrainsService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService,
    private config: NgbAccordionConfig
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('lensId');
    this.agentID = localStorage.getItem('agentID');
    this.getBrainsData();
  }
  getBrainsData() {
    this.ngxService.start();
    forkJoin([
      this.lensBrainService.getBrains(this.serviceId), //get brain list
      this.lensBrainService.fetchBrainData(this.serviceId, this.agentID), //fetch brain list
      this.lensBrainService.getAgentBrainSelected(this.serviceId, this.agentID), //getagentbrainselected
    ])
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        ([brainList, fetchBrain, selectedBrain]) => {
          this.brainData = [];

          if (
            brainList['data']['brains'] &&
            brainList['data']['brains'].length
          ) {
            this.brainList = brainList['data']['brains'];
            this.brainDataList = fetchBrain['data']['brains'];
            if (
              selectedBrain['status'] &&
              selectedBrain['data']['brainSelected'] &&
              selectedBrain['data']['brainSelected'].length
            ) {
              selectedBrain['data']['brainSelected'].forEach((element: any) => {
                this.brainData.push({
                  _id: element.id,

                  subBrains: element.subBrains,
                });
              });
              let valid = true;
              this.brainDataList.forEach((ele: any) => {
                ele['checked'] = false;
                selectedBrain['data']['brainSelected'].forEach((x: any) => {
                  if (x.id == ele._id) {
                    ele['checked'] = true;
                  }
                });
                if (ele.checked == false) {
                  valid = false;
                }
              });
              valid ? (this.selectAll = true) : (this.selectAll = false);
            } else {
              this.brainDataList.forEach((ele: any) => {
                ele['checked'] = false;
              });
            }
          }
          this.ngxService.stop();
        },
        (error: any) => {
          this.toaster.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  addOrDeleteMember(data: any, event: any) {
    if (event.target.checked == true) {
      data.checked = true;
    } else {
      data.checked = false;
    }
    let valid = true;
    this.brainDataList.forEach((ele: any) => {
      if (ele.checked == false) {
        valid = false;
      }
    });
    valid ? (this.selectAll = true) : (this.selectAll = false);
  }

  toggleAccordian(event: any) {
    // If it is already open you will close it and if it is closed open it
    this.activeId = this.activeId == event.panelId ? "" : event.panelId;
  }
  selectDeselectAll(event: any) {
    this.brainData = [];
    if (event.target.checked == true) {
      this.selectAll = true;
      this.brainDataList.forEach((ele: any) => {
        ele['checked'] = true;

      });
    } else {
      this.selectAll = false;
      this.brainDataList.forEach((ele: any) => {
        ele['checked'] = false;
      });
    }
  }
  updateAll() {
    const payload: any = {
      brains: [],
      agentID: this.agentID,
    };

    let array = this.brainDataList
      .filter((v: any) => v.checked)
      .map((a: any) => ({ id: a._id, subBrains: a.subBrains }));
    payload.brains = [...array];

    this.ngxService.start();
    this.lensBrainService
      .addEditBrains(this.serviceId, payload)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (res) => {
          if (res['status']) {
            this.toaster.success(res['message']);
            this.ngxService.stop();
          } else {
            this.toaster.error(res['message']);
            this.ngxService.stop();
          }
        },
        (err) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }

  showDescription(details: any) {
    this.header = details.name;
    this.longDescription = details.description;
  }
}
