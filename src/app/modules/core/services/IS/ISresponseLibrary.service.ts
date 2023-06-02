import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ISResponseLibraryService {
  apiURL: string = environment.url;
  serviceId: any;
  private subject = new BehaviorSubject<any>({});
  public get = this.subject.asObservable();

  constructor(public http: HttpClient) {
    this.serviceId = localStorage.getItem('ISId');
  }

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }
  richCardFetch(serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/responseLibrary/listAllRichCards?serviceID=` + serviceID
    );
  }
  insertResponse(botType: any, payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/responseLibrary/insertForDev?botType=` +
        botType +
        '&serviceID=' +
        this.serviceId,
      payload
    );
  }
  getallResponses(botType: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/responseLibrary/fetchAllResponses?botType` +
        botType +
        '&serviceID=' +
        serviceID
    );
  }
  updateResponse(botType: any, payload: any): Observable<any> {
    return this.http.put(
      `${this.apiURL}/responseLibrary/updateForDev?botType=` +
        botType +
        '&serviceID=' +
        this.serviceId,
      payload
    );
  }
  fetchOneResponse(botType: any, payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/responseLibrary/fetchOneResponse?botType=` +
        botType +
        '&serviceID=' +
        this.serviceId,
      payload
    );
  }
  deleteResponse(botType: any, serviceId: any, payload: any): Observable<any> {
    console.log("paylod", payload)
    let url = `${this.apiURL}/responseLibrary/deleteForDev?botType=` +
    botType +
    '&serviceID=' +
    serviceId
    return this.http.request("delete", url, {body: payload})
  }
  getslots(botType: any, payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/responseLibrary/getSlots?botType=` +
        botType +
        '&serviceID=' +
        this.serviceId,
      payload
    );
  }

  addResp(value: any) {
    this.subject.next(value);
  }

  removeResp(value: any) {
    this.subject.next(value);
  }

  editResp(value: any) {
    this.subject.next(value);
  }

  updateResp(value: any) {
    this.subject.next(value);
  }
}
