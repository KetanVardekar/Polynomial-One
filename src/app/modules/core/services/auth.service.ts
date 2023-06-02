import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
// function _window(): any {
//   return window;
// }
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // get nativeWindow(): any {
  //   return _window();
  // }
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}

  // signUp(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/User/signUp`, payload);
  // }

  signIn(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/login`, payload);
  }

  forgetPassword(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/forgotPassword`, payload);
  }

  userSignup(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/signup`, payload);
  }
  organizationSignup(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/organization/register`, payload);
  }

  getCompanyName(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/organization/fetch-org-name`,
      payload
    );
  }

  getJobTitlesList(): Observable<any> {
    return this.http.get(`${this.apiURL}/organization/fetch-job-titles`);
  }

  getCountries(): Observable<any> {
    return this.http.get(`${this.apiURL}/organization/fetch-countries`);
  }

  verifyEmail(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiURL}/organization/fetch-org-data`,
      payload
    );
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/resetPassword`, payload);
  }

  getRefreshToken(): Observable<any> {
    return this.http.get(`${this.apiURL}/getRefreshToken`);
  }

  verifyEmailFormUrl(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/verifyMail`, payload);
  }

  signupVerification(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/user/fetchUserData`, payload);
  }

  /*user APIS*/

  //   getActivities(): Observable<any> {
  //     return this.http.get(`${this.apiURL}/user/activities`);
  //   }

  //   getNotifications(): Observable<any> {
  //     return this.http.get(`${this.apiURL}/user/notifications`);
  //   }

  //   getCognitiveCores(): Observable<any> {
  //     return this.http.get(`${this.apiURL}/core/cognitiveCores`);
  //   }

  // //Voice Brain----------------------------------------------------

  // getVoiceBrain(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/voiceBrain`);
  // }
  // updateVoiceBrain(payload): Observable<any> {
  //   const agent: string = localStorage.getItem("botType");
  //   return this.http.post(`${this.apiURL}/core/updateVoiceBrain`, payload);
  // }

  //   //getLanguage

  // //Modal brain----------------------------------------------------------

  // getAssistantModeList(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/modalBrain/assistantModeList`);
  // }

  // getAssistantModeInfo(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/modalBrain/assistantModeInfo`);
  // }

  // getModeCharacters(modeName): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/modalBrain/modeCharacters?modeName=` + modeName);
  // }

  // getTypeOfConv(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/modalBrain/typeOfConv`);
  // }

  // getRole(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/modalBrain/role`);
  // }

  // createMode(payload: any): Observable<any> {
  //   return this.http.post(`${this.apiURL}/modalBrain/createMode`, payload);
  // }

  // deleteMode(payload: any): Observable<any> {
  //   const agent: string = localStorage.getItem("botType");
  //   let options = {
  //     body: payload
  //   }
  //   return this.http.request('delete', `${this.apiURL}/modalBrain/deleteMode`, options);
  // }

  // updateModeChars(payload): Observable<any> {
  //   const agent: string = localStorage.getItem("botType");
  //   return this.http.put(`${this.apiURL}/modalBrain/updateCharacters?modeName=`+ payload.assistantMode, payload);
  // }

  // //Personality Brain-----------------------------

  // getPersonalities(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/personalityBrain`);
  // }

  // getSelectedChars(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/personalityBrain/getSelectCharacters`);
  // }

  // updateChars(payload): Observable<any> {
  //   const agent: string = localStorage.getItem("botType");
  //   return this.http.put(`${this.apiURL}/personalityBrain/selectCharacters`, payload);
  // }

  // //Tonal brain -----------------------------------

  // getTonalChars(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/tonalBrain`);
  // }

  // getTonalCharsList(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/tonalBrainCharacterList`);
  // }

  // getToneDescriptorsList(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/tonalBrain/toneDescriptorsList`);
  // }

  // toneDescriptorsInfo(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/tonalBrain/toneDescriptorsData`);
  // }

  // getToneList(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/tonalBrain/toneOfVoiceList`);
  // }

  // getToneInfo(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/core/tonalBrain/toneOfVoiceData`);
  // }

  // updateTonalData(payload): Observable<any> {
  //   const agent: string = localStorage.getItem("botType");
  //   return this.http.put(`${this.apiURL}/tonalBrain/updateTonalData`, payload);
  // }

  // // conversation ---------------------------------------------------------------------

  // getConversation(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/sample-conversations`);
  // }

  // //  agent api's --------------------------------------------------------------------

  // addAgent(data): Observable<any> {
  //   return this.http.post(`${this.apiURL}/agent/add`, data);
  // }

  // updateAgent(data): Observable<any> {
  //   return this.http.put(`${this.apiURL}/agent/update`, data);
  // }

  // getAgent(id): Observable<any> {
  //   return this.http.get(`${this.apiURL}/agent/get?id=` + id);
  // }

  // agentList(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/agent/getAll`);
  // }
}
