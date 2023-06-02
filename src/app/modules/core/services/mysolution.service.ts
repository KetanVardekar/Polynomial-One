import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MysolutionService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}
  getMySolution() {
    return this.http.get(`${this.apiURL}/solutions/my-solutions`);
  }

  activateSolution(payload: any) {
    return this.http.post(
      `${this.apiURL}/solutions/activate-solution`,
      payload
    );
  }
  fileUpload(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/uploads/uploadFile`, payload);
  }
}
