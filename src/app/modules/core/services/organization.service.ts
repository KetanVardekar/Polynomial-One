import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  apiURL: string = environment.url;

  constructor(public http: HttpClient) { }

  getUserMembers(): Observable<any> {
    return this.http.get(`${this.apiURL}/userManagement/listMembers?offset=0&limit=10`);
  }
  fetchOrganizationData(): Observable<any> {
    return this.http.get(`${this.apiURL}/orgManagement/fetch`);
  }
  updateOrganization(payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/orgManagement/edit`, payload);
  }
  getRoleList(): Observable<any> {
    return this.http.get(`${this.apiURL}/role/listRoles`);
  }
  addMember(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/userManagement/addMember`, payload);
  }
  editMember(payload: any): Observable<any> {
    return this.http.put(`${this.apiURL}/userManagement/editMember`, payload);
  }
  getPlatformList(): Observable<any> {
    return this.http.get(`${this.apiURL}/service/listServices`)
  }
  deleteUserMember(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/userManagement/deleteMember`, payload);
  }
  fileUpload(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/uploads/uploadFile`, payload)
  }
}
