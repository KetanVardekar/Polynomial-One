import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  getServiceList(): Observable<any> {
    return this.http.get(`${this.apiURL}/service/listServices`)
  }
  listAgents(serviceId: any): Observable<any> {
    return this.http.get(`${this.apiURL}/agents/get-all-agents?serviceID=` + serviceId);
  }
  getAgentDetails(agentId: any, serviceId: any): Observable<any> {
    return this.http.get(`${this.apiURL}/agents/get-agent-info?serviceID=` + serviceId + "&agentID=" + agentId);
  }
  createAgents(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/agents/add-update-agent`, payload);
  }
  getKits(serviceID: any): Observable<any> {
    return this.http.get(`${this.apiURL}/kit/get-all-kits?serviceID` + serviceID);
  }
  getTeams(serviceID: any): Observable<any> {
    return this.http.get(`${this.apiURL}/get-teams?serviceID=` + serviceID);
  }
}
