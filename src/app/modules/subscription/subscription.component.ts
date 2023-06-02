import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { SubscriptionService } from '../core/services/subscription.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';

declare var Razorpay: any;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  public unsubscribe: Subject<any> = new Subject();
  paymentId = '';
  error = '';
  planChartDetails: any;
  data: any;
  pendingPaymentList: any;
  listPlanList: any;
  historyList: any;
  planList: any;
  subscriptionList: any;
  paymentList: any;
  activatePlanList: any;
  selectedPlan: any;
  planListDetails: any;
  profilePicture: any;
  planId: any;
  paymentAmount: any;

  //Button Flag
  disableactivateFlag: boolean = false
  activatePlanFlag: boolean = false;  //For Payment when Subscription Id is not available
  upgradePlanFlag: boolean = false;  //Upgrading the plan
  disablePaymentFlag: boolean = false //Disable make payment
  enablePaymentFlag: boolean = false;  //Making Payment when subscription Id and pending list is coming
  constructor(
    private subscriptionservice: SubscriptionService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService
  ) { }

  options = {
    key: '',
    amount: '',
    name: '',
    description: 'Billing for May 2022',
    image: '',
    order_id: '',
    handler: function (response: any) {
      var event = new CustomEvent('payment.success', {
        detail: response,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
    },
    prefill: {
      name: '',
      email: '',
      contact: '',
    },
    notes: {
      address: '',
    },
    theme: {
      color: '#1732a4',
    },
  };

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.profilePicture = localStorage.getItem('orgIcon');
    this.getData();
  }

  getData() {
    forkJoin([
      this.subscriptionservice.subscriptionAnalytics(), //subscription details
      this.subscriptionservice.listPlans(), //plan list
      this.subscriptionservice.paymentHistory(), //payment history list
      this.subscriptionservice.pendingPayment(), //pending payment list
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([response1, response2, response3, response4]) => {
          this.subscriptionList = response1['data'];
          this.listPlanList = response2['data'];
          this.historyList = response3['data'];
          this.pendingPaymentList = response4['data'];
          // ---------------------setting flags for activate, upgrade plan and make payment
          if (this.subscriptionList.subscriptionID == null) {
            this.disableactivateFlag = true;
          } else {
            this.listPlanList.forEach((res: any) => {
              if (
                this.subscriptionList.subscriptionID &&
                this.subscriptionList.planName == res.planName
              ) {
                res.selected = true;
              } else {
                this.activatePlanFlag = true;
              }
              if (
                this.subscriptionList.subscriptionID &&
                this.pendingPaymentList &&
                this.pendingPaymentList.length
              ) {
                this.enablePaymentFlag = true;
                this.upgradePlanFlag = false;
                this.activatePlanFlag = false;
              } else {
                // this.makePaymentFlag = false;
                this.disablePaymentFlag = true
                this.activatePlanFlag = false;
              }
            });
          }
          //for getting the selected plan details when the page loads
          this.listPlanList.forEach((res: any) => {
            console.log(this.subscriptionList.planName)
            if (this.subscriptionList.planName == res.planName) {
              this.getSelectedPlanDetails(res.planID)
            }
          });
          // ---------------------
          this.ngxService.stop();
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }

  getSelectedPlanDetails(planId: any) {
    this.subscriptionservice
      .planDetails(planId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.planListDetails = res['data'];
      }, error => {
        this.toaster.error(error.error.message);
      });
  }

  changeEvent(ele: any) {
    this.ngxService.start();
    this.planId = ele.planID;
    this.paymentAmount = ele.planPrice;
    this.listPlanList.forEach((element: any) => {
      element['selected'] = false;
    });
    ele.selected = true;
    //For changing data on clicking

    this.subscriptionservice
      .planDetails(this.planId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response4) => {

        this.planListDetails = response4['data'];
        // -------------------
        if (this.subscriptionList.subscriptionID == null) {
          this.activatePlanFlag = true;
          this.disableactivateFlag = false
          this.enablePaymentFlag = false

          this.ngxService.stop()
          return

        }
        if (
          this.subscriptionList.subscriptionID &&
          this.subscriptionList.planName == this.planListDetails.selectedPlan
        )
          if (this.pendingPaymentList && this.pendingPaymentList.length) {
            this.enablePaymentFlag = true;
            this.upgradePlanFlag = false;
          } else {
            this.disablePaymentFlag = true
            this.upgradePlanFlag = false;

          }
        else {
          this.upgradePlanFlag = true;
          this.disablePaymentFlag = false
          this.enablePaymentFlag = false;

        }
        this.ngxService.stop();
      },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        });
  }
  //Upgrading Plan

  upgradePlan() {
    this.ngxService.start();
    this.subscriptionservice
      .activatePlan(this.planId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['success'] == 'success') {
            this.activatePlanList = data;
            this.subscriptionList.planName = this.planListDetails.selectedPlan;
            this.subscriptionList.amount = this.paymentAmount;
            this.toaster.success(data['message']);
            this.subscriptionservice.pendingPayment().subscribe((data) => {
              if (data['success'] == 'success') {
                if (data['data'] && data['data'].length) {
                  // this.makePaymentFlag = true;
                  this.enablePaymentFlag = true
                  this.upgradePlanFlag = false;
                } else {
                  this.disablePaymentFlag = true
                  this.upgradePlanFlag = false;
                }

              }
            });
            this.getPendingPaymentHistory();
          } else {
            this.toaster.error(data['message']);
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }

  getPendingPaymentHistory() {
    this.subscriptionservice.paymentHistory().pipe(takeUntil(this.unsubscribe)).subscribe(
      data => {
        if (data['data']) {
          this.historyList = data['data'];

        }
        this.ngxService.stop();
      },
      (err: any) => {
        this.toaster.error(err.error.message);
        this.ngxService.stop();
      }
    )
  }

  //For Payment when Subscription Id is not available
  activatedPlan() {
    this.ngxService.start();
    this.subscriptionservice
      .activatePlan(this.planId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          this.activatePlanList = data;
          if (this.activatePlanList) {
            // this.makePaymentFlag = true;
            this.enablePaymentFlag = true
            this.activatePlanFlag = false
            this.upgradePlanFlag = false;
          }
          this.ngxService.stop();
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }
  //For Payment
  makePayment() {


    this.ngxService.start();
    this.subscriptionservice
      .activatePlan(this.planId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          this.activatePlanList = data;
          // if (this.activatePlanList) {

          //   this.enablePaymentFlag = true
          //   this.activatePlanFlag = false
          //   this.upgradePlanFlag = false;
          // }
          this.ngxService.stop();
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }
  @HostListener('window:payment.success', ['$event'])
  onPaymentSuccess(event: any): void {
    const payload = {
      order_id: event.detail.razorpay_order_id,
      payment_id: event.detail.razorpay_payment_id,
      invoiceID: this.pendingPaymentList[0]['invoiceID'],
    };
    this.subscriptionservice
      .verifyOrder(payload, event.detail.razorpay_signature)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.getPendingPaymentHistory();
      }, error => {
        this.toaster.error(error.error.message);
      });
  }


  //rewrite
  // For Pdf Downloading
  fetchInvoicePdf(data: any) {
    this.subscriptionservice.invoicePdf(data).subscribe((res) => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', res.data.url);
      link.setAttribute('download', `file.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
      (err: any) => {
        this.toaster.error(err.error.message);
        this.ngxService.stop();
      })
  }
  payNow(data: any) {

    const payload = {
      amount: data.amount,
      currency: 'INR',
      receipt: data.planName,
      notes: {
        description: 'Billing for May 2022',
        language: 'Interaction Studio and Lens',
      },
    };
    this.subscriptionservice
      .createOrder(payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.paymentList = response;
        this.paymentId = '';
        this.error = '';
        this.options.amount = data.amount; //paise
        this.options.prefill.name = data.planName;
        this.options.order_id = this.paymentList.data.id;
        this.options.image = this.profilePicture;
        this.options.prefill.email = '';
        this.options.prefill.contact = '';
        var rzp1 = new Razorpay(this.options);
        rzp1.open();
        rzp1.on('payment.failed', function (response: any) {
          console.log('Payment Failure reason', response.error.reason);
        });
      },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        });
  }
  // @HostListener('window:payment.success', ['$event'])
  // onPaymentSuccess(event: any): void {
  //   const payload = {
  //     order_id: event.detail.razorpay_order_id,
  //     payment_id: event.detail.razorpay_payment_id,
  //     invoiceID: this.pendingPaymentList[0]['invoiceID'],
  //   };
  //   this.subscriptionservice
  //     .verifyOrder(payload, event.detail.razorpay_signature)
  //     .pipe(takeUntil(this.unsubscribe))
  //     .subscribe((res) => {
  //     }, error => {
  //       this.toaster.error(error.error.message);
  //     });
  // }
}
