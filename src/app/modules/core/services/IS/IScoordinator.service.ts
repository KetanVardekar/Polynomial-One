import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ISCoordinatorService {

  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }

  detachIntent(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/coordinator/detachApiFromIntent?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  integrateIntentWithApi(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/coordinator/integrateApiToCoordinatorForDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  deleteCoordinator(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.request("delete", `${this.apiURL}` + botType + '&serviceID=' + serviceId, {body: payload});
  }
}
