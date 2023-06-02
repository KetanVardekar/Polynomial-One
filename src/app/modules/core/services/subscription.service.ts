import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
// const httpOptions = {

//   headers: new HttpHeaders({

//   'Content-Type':  'application/json',



//  })};
let headers = new HttpHeaders();
@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  apiURL: string = environment.url;

  constructor(public http: HttpClient) {}

  subscriptionAnalytics(): Observable<any> {
    return this.http.get(`${this.apiURL}/billing/subscription-analytics`);
  }
  listPlans(): Observable<any> {
    return this.http.get(`${this.apiURL}/billing/list-plans`);
  }
  // fetchPlanData(planID: any): Observable<any> {
  //   return this.http.get(
  //     `${this.apiURL}/billing/fetch-plan-data?planID=` + planID
  //   );
  // }
  // lastInvoice(): Observable<any> {
  //   return this.http.get(`${this.apiURL}/billing/last-invoice`);
  // }
  paymentHistory(): Observable<any> {
    return this.http.get(`${this.apiURL}/billing/payment-history`);
  }

  planDetails(planID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/billing/fetch-plan-data?planID=` + planID
    );
  }
  activatePlan(planID: any): Observable<any> {
    return this.http.get(
      `${this.apiURL}/billing/activate-plan?planID=` + planID
    );
  }
  pendingPayment(): Observable<any> {
    return this.http.get(`${this.apiURL}/billing/pending-payments`);
  }
  invoicePdf(invoiceID:any): Observable<any> {
  return this.http.get(`${this.apiURL}/billing/fetch-invoice-pdf?invoiceID=` +invoiceID );
}
  //Razorpay API
  createOrder(payload: any): Observable<any> {
    return this.http.post(`${this.apiURL}/payment/create-order`, payload);
  }
  verifyOrder(payload: any,headerValue:any): Observable<any> {
    headers = headers.set('x-razorpay-signature', headerValue);
    return this.http.post(`${this.apiURL}/payment/verify-order`, payload,{ headers: headers });
  }
}
