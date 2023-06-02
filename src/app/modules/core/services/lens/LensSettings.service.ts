import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LensSettingsService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}
  getAgentSettings(agentID: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-agent-settings?agentID=` +
        agentID +
        '&serviceID=' +
        serviceID
    );
  }
  editAgentSettings(
    agentID: any,
    serviceID: any,
    payload: any
  ): Observable<any> {
    return this.http.post(
      `${this.apiURL}/agents/edit-agent-settings?agentID=` +
        agentID +
        '&serviceID=' +
        serviceID,
      payload
    );
  }
  deleteAgentSettings(
    agentID: any,
    serviceID: any,
    payload: any
  ): Observable<any> {
    return this.http.delete(
      `${this.apiURL}/agents/delete-agent?agentID=` +
        agentID +
        '&serviceID=' +
        serviceID,
      payload
    );
  }
}
