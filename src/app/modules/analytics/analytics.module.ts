import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgChartsModule } from 'ng2-charts';
import { OrganizationAnalyticsComponent } from './organization-analytics/organization-analytics.component';
import { PlatformAnalyticsComponent } from './platform-analytics/platform-analytics.component';

@NgModule({
  declarations: [
    AnalyticsComponent,
    OrganizationAnalyticsComponent,
    PlatformAnalyticsComponent,
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    FormsModule,
    HighchartsChartModule,
    NgChartsModule,
    NgSelectModule,
  ],
})
export class AnalyticsModule {}
