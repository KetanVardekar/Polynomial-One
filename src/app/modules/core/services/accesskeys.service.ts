import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessKeysService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }

  apiKeys(agentID: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-api-keys?agentID=` +
        agentID +
        '&serviceID' +
        serviceID
    );
  }
  whiteListDomain(agentID: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-whitelist-domains?agentID=` +
        agentID +
        '&serviceID' +
        serviceID
    );
  }
  addUpdateDomain(serviceID: any, payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/agents/add-update-domains?serviceID=` + serviceID,
      payload
    );
  }
}
