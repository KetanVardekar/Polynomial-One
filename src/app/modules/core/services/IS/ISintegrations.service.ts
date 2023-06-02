import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ISIntegrationsService {

  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }

  getAPIList(botType: any, searchQuery: any, serviceId: any): Observable<any> {
    return this.http.get(`${this.apiURL}/integration/fetchAllApiDetails?botType=` + botType + `&searchQuery=` + searchQuery + `&serviceID=` + serviceId);
  }
  addApi(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/integration/addApiDetailsToDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  enableDisableAPI(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/integration/toggleApiToDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  updateApi(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/integration/updateApiDetailsToDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  deleteApi(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.request("delete", `${this.apiURL}/integration/deleteApiToDev?botType=` + botType + `&serviceID=` + serviceId, {body: payload});
  }
}
