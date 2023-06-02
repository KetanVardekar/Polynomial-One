import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ISchannelIntegrationService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  channelIntegration() {
    return this.http.get(`${this.apiURL}/channels/fetch-channels`);
  }
  fetchActiveChannels(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/channels/fetch-active-channels`, payload);
  }
  createChannel(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/channels/create-channel`, payload);
  }
  activateChannel(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/channels/activate-channel`, payload);
  }
  fetchChannelData(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/channels/fetch-channel-data`, payload);
  }
  editChannel(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/channels/edit-channel`, payload);
  }
  deleteChannel(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/channels/delete-channel`, payload);
  }
  // activeChannelIntegration() {
  //   return this.http.get(`${this.apiURL}/channels/fetch-active-channels`);
  // }

  // createChannel(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/channels/create-channel`, payload);
  // }

  // deleteChannel(channelID: any, payload: any): Observable<any> {
  //   return this.http.delete(
  //     `${this.apiURL}/channels/delete-channel?channelID=` + channelID,
  //     payload
  //   );
  // }

  // editChannel(payload: any) {
  //   return this.http.put(`${this.apiURL}/channels/edit-channel`, payload);
  // }

  // fetchChannelData(id: any) {
  //   return this.http.get(`${this.apiURL}/channels/fetch-channel-data?id=` + id);
  // }
}
