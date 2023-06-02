import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  apiURL: string = environment.url;


  constructor(public http: HttpClient) {

  }

  fetchNotification(): Observable<any> {
    return this.http.get(`${this.apiURL}/notifications/fetch-notifications`);
  }

  updateNotification(payload:any){
    return this.http.post(`${this.apiURL}/notifications/update-seen-notifications`,payload)
  }
}
