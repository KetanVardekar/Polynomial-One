import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LensDataRelationShipService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }
  dataRelations(agentID: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-data-relation?agentID=` +
        agentID +
        `&serviceID=` +
        serviceID
    );
  }
  dataRelationtemplate(agentID: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/agents/get-data-relation-template?agentID=` +
        agentID +
        `&serviceID=` +
        serviceID
    );
  }
  addEditDataRelation(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/agents/add-edit-data-relation`,
      payload
    );
  }
}
