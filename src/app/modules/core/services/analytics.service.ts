import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class analyticsService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}
  fetchOrgAnalytics(): Observable<any> {
    return this.http.get(`${this.apiURL}/analytics/fetch-org-analytics`);
  }
  fetchOrgUsageAnalytics(analytics: any, period: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/analytics/fetch-org-usage-analytics?analytics=` +
        analytics +
        '&period=' +
        period
    );
  }
  fetchOrgCostAnalytics(analytics: any, period: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/analytics/fetch-org-usage-analytics?analytics=` +
        analytics +
        '&period=' +
        period
    );
  }
  fetchPlatformAnalytics(): Observable<any> {
    return this.http.get(`${this.apiURL}/analytics/fetch-platform-analytics`);
  }

  fetchPerformanceAnalytics(year: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/analytics/performance-analytics?year=` + year
    );
  }
  fetchTopPerformingFiveAgent(analytics: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/analytics/top-five-performing-agents?analytics=` +
        analytics
    );
  }
}
