import { ToastrService } from 'ngx-toastr';
import { ISIntentsService } from './../../core/services/IS/ISintents.service';
import { Component, OnInit } from '@angular/core';
import { ISResponseLibraryService } from '../../core/services/IS/ISresponseLibrary.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { Router } from '@angular/router';
import { DeletePopUpComponent } from '../../common/delete-pop-up/delete-pop-up.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-response-library',
  templateUrl: './response-library.component.html',
  styleUrls: ['./response-library.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(
          ':enter',
          stagger(100, [
            animate(
              '.3s ease-out',
              keyframes([
                style({ opacity: 0, transform: 'translateY(60px)' }),
                style({ opacity: 1, transform: 'translateY(0)' }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ResponseLibraryComponent implements OnInit {
  private unsubscribe = new Subject<any>();
  serviceId: any;
  botType: any;
  botName: any;
  searchQuery: any = '';
  public tab: any = 'generic';
  title: any;
  genericIntents: any = [];
  specificIntents: any = [];
  faqIntents: any = [];

  constructor(
    private isresponselibrary: ISResponseLibraryService,
    private ngxService: NgxUiLoaderService,
    private isIntentsService: ISIntentsService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    this.getIntentList();
    // this.getrichcardfetch();
    // this.getinsertresponse();
    // this.getallresponses();
    // this.getupdateresponse();
    // this.getfetchoneresponse();
    // this.getdeleteresponse();
    // this.slots();
  }
  getIntentList() {
    // 0 - for all intents
    // 1 - Generic intents
    // 2 - Specific intents
    // 3 - FAQ intents
    this.ngxService.start();
    forkJoin([
      this.isIntentsService.getIntentList(
        1,
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe((catchError((err)=>{return of (undefined)}))), // Generic intents
      this.isIntentsService.getIntentList(
        2,
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe((catchError((err)=>{return of (undefined)}))), // Specific intents
      this.isIntentsService.getIntentList(
        3,
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe((catchError((err)=>{return of (undefined)}))), // FAQ intents
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (result) => {
          if(result[0] && result[0].data && result[0].data.length){
            this.genericIntents = result[0].data;
          }
          if(result[1] && result[1].data && result[1].data.length){
            this.specificIntents = result[1].data;
          }
          if(result[2] && result[2].data && result[2].data.length){
            this.faqIntents = result[2].data;
          }
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }

  editIntent(intent: any) {

  }
  deleteResponse(intent: any) {
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'You want To delete this response named';
    modalRef.componentInstance.selectedName = intent
    modalRef.result.then((result) => {
      if (result) {
        this.ngxService.start();
        const payload = {
          id: '',
          intentName: intent,
        };
        this.isresponselibrary
          .deleteResponse(this.botType, this.serviceId, payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);
                this.getIntentList();
              } else {
                this.toastr.error(data['message']);
                this.ngxService.stop();
              }
            },
            (error) => {
              this.toastr.error(error.error.message);
              this.ngxService.stop();
            }
          );
      }
    });
  }

  getRichCardFetch() {
    this.isresponselibrary.richCardFetch(this.serviceId).subscribe((res) => {
      console.log(res);
    });
  }
  getInsertResponse() {
    this.isresponselibrary
      .insertResponse(this.botType, this.serviceId)
      .subscribe((res) => {
        console.log(res);
      });
  }
  getAllResponses() {
    this.isresponselibrary
      .getallResponses(this.botType, this.serviceId)
      .subscribe((res) => {
        console.log(res);
      });
  }
  getUpdateResponse() {
    this.isresponselibrary
      .updateResponse(this.botType, this.serviceId)
      .subscribe((res) => {
        console.log(res);
      });
  }
  getFetchOneResponse() {
    this.isresponselibrary
      .fetchOneResponse(this.botType, this.serviceId)
      .subscribe((res) => {
        console.log(res);
      });
  }

  slots() {
    this.isresponselibrary
      .getslots(this.botType, this.serviceId)
      .subscribe((res) => {
        console.log(res);
      });
  }
  searchResponse() {
    forkJoin([
      this.isIntentsService.getIntentList(
        1,
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe((catchError((err)=>{return of (undefined)}))), // Generic intents
      this.isIntentsService.getIntentList(
        2,
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe((catchError((err)=>{return of (undefined)}))), // Specific intents
      this.isIntentsService.getIntentList(
        3,
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe((catchError((err)=>{return of (undefined)}))), // FAQ intents
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (result) => {
          if(result[0] && result[0].data && result[0].data.length){
            this.genericIntents = result[0].data;
          }
          if(result[1] && result[1].data && result[1].data.length){
            this.specificIntents = result[1].data;
          }
          if(result[2] && result[2].data && result[2].data.length){
            this.faqIntents = result[2].data;
          }
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }

}
