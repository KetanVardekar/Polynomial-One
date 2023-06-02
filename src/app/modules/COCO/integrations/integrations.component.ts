import { AddEditApiIntegrationsComponent } from './../add-edit-api-integrations/add-edit-api-integrations.component';
import { ISIntegrationsService } from './../../core/services/IS/ISintegrations.service';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeletePopUpComponent } from '../../common/delete-pop-up/delete-pop-up.component';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
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
export class IntegrationsComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<any>();
  serviceId: any;
  botType: any;
  searchQuery: any = '';
  public tab: any = 'available';
  timeoutId: any;
  apiList: any = [];
  botName: any;
  title: any;
  constructor(
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private isIntegrationService: ISIntegrationsService
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    this.getApiList();
  }
  getApiList() {
    this.ngxService.start();
    this.isIntegrationService
      .getAPIList(this.botType, this.searchQuery, this.serviceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.apiList = data['data'];
            this.cdr.detectChanges();
            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.errpr.message);
          this.ngxService.stop();
        }
      );
  }
  searchIntegrations() {
    this.isIntegrationService
      .getAPIList(this.botType, this.searchQuery, this.serviceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data['status']) {
          this.apiList = data['data'];
          this.cdr.detectChanges();
        } else {
          this.toastr.error(data['message']);
        }
      });
  }
  addAPI() {
    const modalRef = this.modalService.open(AddEditApiIntegrationsComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.result.then((result) => {
      if (result) {
        this.getApiList();
      }
    });
  }

  searchEntities() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getApiList();
    }, 450);
  }
}
