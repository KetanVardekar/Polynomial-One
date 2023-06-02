import { Component, OnInit, ViewChild } from '@angular/core';
import { LensInsightsService } from '../../core/services/lens/LensInsights.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();
  activeId: string = "";
  ServiceId: any;
  agentID: any;
  insightsData: any = [];
  insightDescription: any = '';
  imageUrl: any = '';
  selectAll: any;

  insightList: any = [];
  constructor(
    private lensInsightsService: LensInsightsService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.ServiceId = localStorage.getItem('lensId');
    this.agentID = localStorage.getItem('agentID');
    this.getInsightsData();
  }

  getInsightsData() {
    this.ngxService.start();
    forkJoin([
      this.lensInsightsService.listInsights(this.agentID, this.ServiceId),
      this.lensInsightsService.agentInsightsSelected(
        this.ServiceId,
        this.agentID
      ),
    ])
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        ([listInsightsdata, insightSelectedData]) => {
          this.insightsData = [];
          if (
            listInsightsdata['data']['insights'] &&
            listInsightsdata['data']['insights'].length
          ) {
            this.insightList = listInsightsdata['data']['insights'];

            // this.insightDescription = this.insightList[0].description;
            // this.imageUrl = this.insightList[0].insightVisual;

            if (
              insightSelectedData['status'] &&
              insightSelectedData['data']['insightSelected'] &&
              insightSelectedData['data']['insightSelected'].length
            ) {
              insightSelectedData['data']['insightSelected'].forEach(
                (element: any) => {
                  this.insightsData.push({
                    _id: element,
                    agentID: this.agentID,
                  });
                }
              );
              let valid = true;
              this.insightList.forEach((ele: any) => {
                ele['checked'] = false;
                insightSelectedData['data']['insightSelected'].forEach(
                  (x: any) => {
                    if (x == ele._id) {
                      ele['checked'] = true;
                    }
                  }
                );
                if (ele.checked == false) {
                  valid = false;
                }
              });
              valid ? (this.selectAll = true) : (this.selectAll = false);
            } else {
              this.insightList.forEach((ele: any) => {
                ele['checked'] = false;
              });
            }
          }
          this.ngxService.stop();
        },
        (err) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }

  toggleAccordian(event:any) {
    // If it is already open you will close it and if it is closed open it
    this.activeId = this.activeId == event.panelId ? "" : event.panelId;
}
  addOrDeleteMember(data: any, event: any) {
    if (event.target.checked == true) {
      data.checked = true;
    } else {
      data.checked = false;
    }
    let valid = true;
    this.insightList.forEach((ele: any) => {
      if (ele.checked == false) {
        valid = false;
      }
    });
    valid ? (this.selectAll = true) : (this.selectAll = false);
  }
  selectDeselectAll(event: any) {
    this.insightsData = [];
    if (event.target.checked == true) {
      this.selectAll = true;
      this.insightList.forEach((ele: any) => {
        ele['checked'] = true;
      });
    } else {
      this.selectAll = false;
      this.insightList.forEach((ele: any) => {
        ele['checked'] = false;
      });
    }
  }
  updateAll() {
    this.ngxService.start();
    const payload: any = {
      insightsID: [],
      agentID: this.agentID,
    };

    let array1 = this.insightList
      .filter((v: any) => v.checked)
      .map((a: any) => a._id);
    payload.insightsID = [...array1];

    this.lensInsightsService
      .addEditInsight(this.ServiceId, payload)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (res: any) => {
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

  showDescription(description: any, insightVisual: any) {
    this.insightDescription = description;
    this.imageUrl = insightVisual;
  }
}
