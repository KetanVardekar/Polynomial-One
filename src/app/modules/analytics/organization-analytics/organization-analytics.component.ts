import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, Color } from 'chart.js';
import { analyticsService } from '../../core/services/analytics.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-organization-analytics',
  templateUrl: './organization-analytics.component.html',
  styleUrls: ['./organization-analytics.component.scss'],
})
export class OrganizationAnalyticsComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();

  public subTab: any = 'yearly';
  organizationName: any;
  orgIcon: any;
  orgAnalyticsList: any;
  organizationGraphTitle: any = 'Usage Analytics';
  pieChartGraphData: any;
  organizationAnalytics: any = [];
  organizationYear: any = '2022';
  // For Graph

  public orgLineChartLabels: any = [];
  public orgLineChartData: ChartDataset[] = [];
  public pieChartLabels: any = [];
  public pieChartData: ChartDataset[] = [];
  public pieChartData2: ChartDataset[] = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public lineChartPlugins = [];
  public orgLineChartLegend = false;
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  lineChartOptions = {
    responsive: true,
  };
  yearsList: any = [
    {
      year: '2007',
      value: 1,
    },
    {
      year: '2008',
      value: 2,
    },
    {
      year: '2009',
      value: 3,
    },
    {
      year: '2010',
      value: 4,
    },
    {
      year: '2011',
      value: 5,
    },
    {
      year: '2012',
      value: 6,
    },
    {
      year: '2013',
      value: 7,
    },
    {
      year: '2014',
      value: 8,
    },
    {
      year: '2015',
      value: 9,
    },
    {
      year: '2016',
      value: 10,
    },
    {
      year: '2017',
      value: 11,
    },
    {
      year: '2018',
      value: 12,
    },
    {
      year: '2019',
      value: 13,
    },
    {
      year: '2020',
      value: 14,
    },
    {
      year: '2021',
      value: 15,
    },
    {
      year: '2022',
      value: 16,
    },
  ];
  constructor(
    private analyticsService: analyticsService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.organizationName = localStorage.getItem('organization');
    this.orgIcon = localStorage.getItem('orgIcon');
    this.organizationYear;
    // this.getOrgAnalyticsData();
    this.getAnalyticsDataWithFilter();
    // this.getAnalyticsDataForPie();
  }
  getOrgAnalyticsData() {
    this.ngxService.start();
    this.analyticsService
      .fetchOrgAnalytics()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.orgAnalyticsList = data['data'];

            // for (let item in this.orgAnalyticsList) {
            //   switch (item) {
            //     case 'totalAgents':
            //       this.organizationAnalytics.push({
            //         text: 'Total agents',
            //         value: this.orgAnalyticsList.totalAgents,
            //       });
            //       break;
            //     case 'totalUsageHrs':
            //       this.organizationAnalytics.push({
            //         text: 'usage hours (in hr)',
            //         value: this.orgAnalyticsList.totalUsageHrs,
            //       });
            //       break;
            //     case 'totalCredits':
            //       this.organizationAnalytics.push({
            //         text: 'Total credits Offered',
            //         value: this.orgAnalyticsList.totalCredits,
            //       });
            //       break;
            //     case 'plan':
            //       this.organizationAnalytics.push({
            //         text: 'Subscription Plan',
            //         value: this.orgAnalyticsList.plan,
            //       });
            //       break;
            //     case 'totalInsights':
            //       this.organizationAnalytics.push({
            //         text: 'Total Insights',
            //         value: this.orgAnalyticsList.totalInsights,
            //       });
            //       break;
            //     case 'totalInteractions':
            //       this.organizationAnalytics.push({
            //         text: 'Total Interactions',
            //         value: this.orgAnalyticsList.totalInteractions,
            //       });
            //       break;
            //   }
            // }
            this.ngxService.stop();
          } else {
            this.toaster.error(data['message']);
            this.ngxService.stop();
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }
  getAnalyticsDataWithFilter() {
    this.ngxService.start();

    this.getOrgAnalyticsData();

    this.analyticsService
      .fetchOrgCostAnalytics(
        this.organizationGraphTitle ? 'usage' : 'cost',
        this.subTab
      )
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.orgLineChartData = [];
            this.orgLineChartLabels = Object.keys(data['data']);

            this.orgLineChartData.push({
              data: Object.values(data['data']),
            });
            this.ngxService.stop();
          } else {
            this.toaster.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toaster.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }
  //For Pie Chart Data
  // getAnalyticsDataForPie() {
  //   this.ngxService.start();
  //   this.analyticsService
  //     .fetchOrgCostAnalytics(
  //       this.organizationGraphTitle ? 'cost' : 'usage',
  //       this.subTab
  //     )
  //     .pipe(takeUntil(this.unSubscribe))
  //     .subscribe(
  //       (res) => {
  //         if (res['status']) {
  //           this.pieChartGraphData = res['data'];

  //           this.pieChartLabels = Object.keys(this.pieChartGraphData.credits);

  //           this.pieChartData.push({
  //             data: Object.values(this.pieChartGraphData.credits),
  //           });
  //           this.pieChartData2.push({
  //             data: Object.values(this.pieChartGraphData.credits),
  //           });
  //           this.ngxService.stop();
  //         } else {
  //           this.toaster.error(res['message']);
  //           this.ngxService.stop();
  //         }
  //       },
  //       (error) => {
  //         this.toaster.error(error.error.message);
  //         this.ngxService.stop();
  //       }
  //     );
  // }
}
