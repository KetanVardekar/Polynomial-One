import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ISEntitiesService {

  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }

  listEntites(entityType: any, searchQuery: any, botTYpe: any, serviceID: any): Observable<any> {
    return this.http.get(`${this.apiURL}/Entities/list?entityType=` + entityType + "&searchQuery=" + searchQuery + "&botType=" + botTYpe + "&serviceID=" + serviceID);
  }

  createEntity(payload: any, botType: any, serviceId: any): Observable<any> {
    return this.http.post(`${this.apiURL}/Entities/createToDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }

  fetchEntityData(botType: any, entityType: any, searchQuery: any,serviceId:any ,payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/Entities/fetchOne?botType=` + botType + "&entityType=" + entityType + "&searchQuery=" + searchQuery + "&serviceID=" + serviceId, payload);
  }

  updateEntity(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/Entities/updateToDev?botType=` + botType + `&serviceID=` + serviceId, payload);
  }

  updateEntityByJsonFile(botType: any, entityType: any, entityName: any, serviceID:any, payload: any) {
    return this.http.put(`${this.apiURL}/Entities/updateEntityByJsonFile?botType=` + botType + "&entityType=" + entityType + "&entityName=" + entityName + "&serviceID=" + serviceID, payload);
  }

  deleteEntity(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.request("delete", `${this.apiURL}/Entities/deleteToDev?botType=` + botType + '&serviceID=' + serviceId, {body: payload});
  }
}
