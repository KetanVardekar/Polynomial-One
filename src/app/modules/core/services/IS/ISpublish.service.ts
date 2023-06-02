import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ISPublishService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }

  getBotStatus(botType: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/botStatus?botType=` + botType + '&serviceID=' + serviceID
    );
  }

  botHistory(botType: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/botHistory?botType=` + botType + '&serviceID=' + serviceID
    );
  }
  botVersion(botType: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/version?botType=` + botType + '&serviceID=' + serviceID
    );
  }
  getEmbedUrl(botType: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/bot/getEmbedUrl?botType=` +
      botType +
      '&serviceID=' +
      serviceID
    );
  }
  fetchIntentToPublish(botType: any, serviceID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/publish/getIntentsList?botType=` +
      botType +
      '&serviceID=' +
      serviceID
    );
  }
  restore(payload: any, botType: any, serviceId: any): Observable<any> {
    return this.http.post(`${this.apiURL}/restore?botType=` + botType + `&serviceID=` + serviceId, payload);
  }
  publishIntents(botType: any, serviceId: any, payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/publish/publishSelectedIntents?botType=` + botType + '&serviceID=' + serviceId, payload);
  }
}
