import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ISIntegrationsService } from './../../core/services/IS/ISintegrations.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ISIntentsService } from '../../core/services/IS/ISintents.service';

@Component({
  selector: 'app-coordinator',
  templateUrl: './coordinator.component.html',
  styleUrls: ['./coordinator.component.scss'],
})
export class CoordinatorComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<any>();
  serviceId: any;
  botType: any;
  botName: any;
  searchQuery: any = '';
  mappedCoordinators: any = [];
  availableCoordinators: any = [];
  apiList: any = [];
  noCoordinator: any;
  timeoutId:any
  public tab: any = 'mapped';
  constructor(
    private isIntegrationService: ISIntegrationsService,
    private isInetentService: ISIntentsService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService
  ) {}
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    this.getCoordinators();
  }

  getCoordinators() {
    this.ngxService.start();
    this.mappedCoordinators = [];
    this.availableCoordinators = [];
    this.apiList = [];
    forkJoin([
      this.isIntegrationService.getAPIList(
        this.botType,
        this.searchQuery,
        this.serviceId
      ),
      this.isInetentService.getIntentList(
        0,
        this.searchQuery,
        this.botType,
        this.serviceId
      ),
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([apiList, intentList]) => {
          this.apiList = apiList['data'];

          intentList['data'].forEach((element: any) => {
            console.log("cororo", element)
            let coordinator = apiList['data'].filter(
              (x: any) => x.intentName == element.intentName
            );
            if (coordinator.length > 0) {
              coordinator.forEach((cordi: any) => {
                this.mappedCoordinators.push(cordi);
              });
            }
          });
          intentList['data'].filter((x: any, i: any) => {
            this.mappedCoordinators.forEach((element: any) => {
              if (element.intentName == x) {
                intentList['data'].splice(i, 1);
              }
            });
          });
          this.availableCoordinators = intentList['data'];

          this.ngxService.stop();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }
  searchEntities() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getCoordinators();
    }, 450);
  }
}
