import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  updateProfile(payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/profile/updateProfile`, payload);
  }

  changePassword(payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/profile/changePassword`, payload);
  }

  updateSettings(payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/profile/updateAccountDetails
    `, payload);
  }

  getActivityList(): Observable<any> {
    return this.http.get(`${this.apiURL}/profile/fetchActivity`);
  }

  getSettingsDetails(): Observable<any> {
    return this.http.get(`${this.apiURL}/profile/getAccountDetails`);
  }

  getProfileDetails(): Observable<any> {
    return this.http.get(`${this.apiURL}/profile/getUserProfile`);
  }
  getHelpDetails(search:any): Observable<any> {
    return this.http.get(`${this.apiURL}/profile/fetchHelp?search=`+ search);
  }
}
