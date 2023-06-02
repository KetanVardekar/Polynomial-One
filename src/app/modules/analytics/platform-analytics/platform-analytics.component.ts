import { Component, OnInit } from '@angular/core';
import { ChartDataset } from 'chart.js';
import { analyticsService } from '../../core/services/analytics.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Subject } from 'rxjs';

@Component({
  selector: 'app-platform-analytics',
  templateUrl: './platform-analytics.component.html',
  styleUrls: ['./platform-analytics.component.scss'],
})
export class PlatformAnalyticsComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();
  public subTab: any = 'weekly';
  platformYear: any = '2022';
  organizationName: any;
  orgIcon: any;

  paltformAnalyticsList: any;
  monthListData: any;

  performanceAnalyticsList: any;
  cardDetails: any = [];
  yearsList: any = [
    {
      year: '2020',
      value: 2020,
    },
    {
      year: '2021',
      value: 2021,
    },
    {
      year: '2022',
      value: 2022,
    },
  ];

  //For Graph
  public lineChartData: ChartDataset[] = [];
  public lineChartLabels: any = [];

  lineChartOptions = {
    responsive: true,
  };
  public lineChartPlugins = [];
  public lineChartLegend = true;
  constructor(
    private analyticsService: analyticsService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.organizationName = localStorage.getItem('organization');
    this.orgIcon = localStorage.getItem('orgIcon');
    this.subTab;
    this.getAnalyticsData();
  }
  getAnalyticsData() {
    this.ngxService.start();
    forkJoin([
      this.analyticsService.fetchPlatformAnalytics(),
      this.analyticsService.fetchPerformanceAnalytics(this.platformYear),
    ])
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        ([response1, response2]) => {
          if (response1['status']) {
            this.paltformAnalyticsList = response1['data'];

            if (response2['status']) {
              this.performanceAnalyticsList = response2['data'];
              console.log(this.performanceAnalyticsList);
              this.lineChartData.push({
                data: Object.values(this.performanceAnalyticsList.lens),
                label: 'Lens',
              });
              this.lineChartData.push({
                data: Object.values(this.performanceAnalyticsList.coco),
                label: 'COCO',
              });
              this.lineChartLabels = Object.keys(
                this.performanceAnalyticsList.coco
              );
            }

            this.ngxService.stop();
          } else {
            this.toaster.error(response1['message']);
            this.toaster.error(response2['message']);
            this.ngxService.stop();
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }
  getYearGraphData() {
    this.analyticsService
      .fetchPerformanceAnalytics(this.platformYear)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((res) => {
        if (res['status']) {
          this.lineChartData = [];

          this.lineChartData.push({
            data: Object.values(res['data'].lens),
            label: 'Lens',
          });
          this.lineChartData.push({
            data: Object.values(res['data'].coco),
            label: 'Coco',
          });
        }
      });
  }
}
