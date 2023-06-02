import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LensBrainsService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}

  getBrains(serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-brains-list?serviceID=` + serviceID
    );
  }
  fetchBrainData(serviceID: any, agentID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/brains/get-all-brains?serviceID=` +
        serviceID +
        '&agentID=' +
        agentID
    );
  }
  getAgentBrainSelected(serviceID: any, agentID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-agent-brains-selected?serviceID=` +
        serviceID +
        '&agentID=' +
        agentID
    );
  }
  addEditBrains(serviceID: any, payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/agents/add-edit-brains?serviceID=` + serviceID,
      payload
    );
  }
}
