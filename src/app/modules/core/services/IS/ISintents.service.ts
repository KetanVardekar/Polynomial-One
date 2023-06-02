import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ISIntentsService {

  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }

  getSlotList(searchQuery: any, botType: any, serviceId: any): Observable<any> {
    return this.http.get(`${this.apiURL}/Entities/list?entityType=all&searchQuery=` + searchQuery + `&botType=` + botType + `&serviceID=` + serviceId);
  }
  getIntentList(intentType: any, searchQuery: any, botType: any, serviceId: any): Observable<any> {
    return this.http.get(`${this.apiURL}/Intents/list?intentTypeId=` + intentType + `&searchQuery=` + searchQuery + `&botType=` + botType + `&serviceID=` + serviceId);
  }
  createIntent(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/Intents/createToDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  fetchIntentData(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/Intents/fetchOne?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  updateIntent(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/Intents/updateToDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  updateIntentByJSONFile(botType: any, intentName: any, intentType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/Intents/updateIntentByJsonFile?botType=` + botType + `&intentName=` + intentName + `&intentTypeId=` + intentType + `&serviceID=` + serviceId, payload);
  }
  deleteIntent(botType:any, serviceId:any,payload:any): Observable<any> {
    return this.http.request("delete", `${this.apiURL}/Intents/deleteToDev?botType=` + botType + `&serviceID=` + serviceId, {body: payload});
  }

}
