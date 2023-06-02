import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LensInsightsService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}

  listInsights(agentID: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/insights/get-insights-list?agentID=` +
        agentID +
        '&serviceID=' +
        serviceID
    );
  }
  agentInsightsSelected(serviceID: any, agentID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-agent-insights-selected?serviceID=` +
        serviceID +
        '&agentID=' +
        agentID
    );
  }
  addEditInsight(serviceID: any, payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/agents/add-edit-insights?serviceID=` + serviceID,
      payload
    );
  }
}
