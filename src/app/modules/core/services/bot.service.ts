import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class BotService {
  apiURL: string = environment.url;
  private subject = new BehaviorSubject<any>({});
  public getBotAvatarURI = this.subject.asObservable();

  constructor(public http: HttpClient) {}

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }
  updateAvatarURI(value: any){
    this.subject.next(value);
  }

  trainAgent(serviceID: any): Observable<any> {
    const agent: any = localStorage.getItem("botType");
    return this.http.post(`${this.apiURL}/bot/trainBot?serviceID=` + serviceID + `&&botType=${agent}`, {});
  }

  fetchBot(serviceID: any): Observable<any> {
    const agent: any = localStorage.getItem("botType");
    serviceID = localStorage.getItem("ISId")
    return this.http.get(`${this.apiURL}/bot/fetchOneBotInfo?serviceID=` + serviceID + `&botType=${agent}`);
  }

  botList(serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/bot/listAllBots?serviceID=` + serviceID
    );
  }

  createBot(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/bot/createBots`, payload);
  }

  encryptBot(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/bot/encryptBotType`, payload);
  }

  decryptBot(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/bot/decryptBotType`, payload);
  }
  updateBotinfo(payload: any, serviceID: any): Observable<any> {
    return this.http.put(`${this.apiURL}/bot/updateBotInfo?serviceID=` + serviceID, payload);
  }
  deleteBot(payload: any, serviceID: any): Observable<any> {
    return this.http.post(`${this.apiURL}/bot/deleteBot?serviceID=` + serviceID, payload);
  }

  getLogDetails(agent: any, serviceID: any): Observable<any> {
    return this.http.get(`${this.apiURL}/bot/get/logs?serviceID=` + serviceID + `&botType=${agent}`);
  }

  activateLogs(payload: any, serviceID: any): Observable<any> {
    return this.http.post(`${this.apiURL}/bot/activate/logs?serviceID=` + serviceID, payload)
  }

  updateLogs(payload:any, serviceID: any): Observable<any> {
    return this.http.put(`${this.apiURL}/bot/update/logs?serviceID=` + serviceID, payload)
  }

  disableLogs(payload:any, serviceID: any): Observable<any> {
    return this.http.post(`${this.apiURL}/bot/disable/logs?serviceID=` + serviceID, payload);
  }
}
