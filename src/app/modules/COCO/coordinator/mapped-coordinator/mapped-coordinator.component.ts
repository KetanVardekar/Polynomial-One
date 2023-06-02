import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISCoordinatorService } from 'src/app/modules/core/services/IS/IScoordinator.service';
import { ISIntegrationsService } from 'src/app/modules/core/services/IS/ISintegrations.service';
import { ISIntentsService } from 'src/app/modules/core/services/IS/ISintents.service';
import { AddEditCoordinatorComponent } from '../../add-edit-coordinator/add-edit-coordinator.component';
import { DeletePopUpComponent } from 'src/app/modules/common/delete-pop-up/delete-pop-up.component';

@Component({
  selector: 'app-mapped-coordinator',
  templateUrl: './mapped-coordinator.component.html',
  styleUrls: ['./mapped-coordinator.component.scss'],
})
export class MappedCoordinatorComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<any>();
  serviceId: any;
  botType: any;
  botName: any;
  searchQuery: any;
  @Input() mapCoordinarorData: any;
  @Input() apiList: any;
  mappedCoordinators: any = [];
  // apiList: any = [];

  constructor(
    private isCoordinatorService: ISCoordinatorService,
    private isIntegrationService: ISIntegrationsService,
    private isInetentService: ISIntentsService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    console.log(this.mapCoordinarorData, this.apiList, "helo")
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    // this.getCoordinators();
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  // getCoordinators() {
  //   this.ngxService.start();
  //   this.mappedCoordinators = [];

  //   this.apiList = [];

  //   this.isInetentService
  //     .getIntentList(0, this.searchQuery, this.botType, this.serviceId)

  //     .pipe(takeUntil(this.unsubscribe))
  //     .subscribe(
  //       ([apiList, intentList]) => {
  //         this.apiList = apiList['data'];
  //         intentList['data'].forEach((element: any) => {
  //           let coordinator = apiList['data'].filter(
  //             (x: any) => x.intentName == element
  //           );
  //           if (coordinator.length > 0) {
  //             coordinator.forEach((cordi: any) => {
  //               this.mappedCoordinators.push(cordi);
  //             });
  //           }
  //         });
  //         intentList['data'].filter((x: any, i: any) => {
  //           this.mappedCoordinators.forEach((element: any) => {
  //             if (element.intentName == x) {
  //               intentList['data'].splice(i, 1);
  //             }
  //           });
  //         });
  //         // this.availableCoordinators = intentList['data'];
  //         this.ngxService.stop();
  //       },
  //       (error) => {
  //         this.toastr.error(error.error.message);
  //         this.ngxService.stop();
  //       }
  //     );
  // }
  // getCoordinators() {
  //   this.ngxService.start();
  //   this.mappedCoordinators = [];

  //   this.apiList = [];

  //   this.isInetentService
  //     .getIntentList(0, this.searchQuery, this.botType, this.serviceId)
  //     .pipe(takeUntil(this.unsubscribe))
  //     .subscribe(
  //       ([apiList, intentList]) => {
  //         this.apiList = apiList['data'];
  //         intentList['data'].forEach((element: any) => {
  //           let coordinator = apiList['data'].filter(
  //             (x: any) => x.intentName == element
  //           );
  //           if (coordinator.length > 0) {
  //             coordinator.forEach((cordi: any) => {
  //               this.mappedCoordinators.push(cordi);
  //             });
  //           }
  //         });
  //         intentList['data'].filter((x: any, i: any) => {
  //           this.mappedCoordinators.forEach((element: any) => {
  //             if (element.intentName == x) {
  //               intentList['data'].splice(i, 1);
  //             }
  //           });
  //         });
  //         // this.availableCoordinators = intentList['data'];
  //         // this.ngxService.stop();
  //         this.ngxService.stop();
  //       },
  //       (error) => {
  //         this.toastr.error(error.error.message);
  //         this.ngxService.stop();
  //       }
  //     );
  // }

  detachIntent(name: any) {
    this.ngxService.start();
    const payload = {
      intentName: name,
    };
    this.isCoordinatorService
      .detachIntent(this.botType, this.serviceId, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
            this.ngxService.stop();
            // this.getCoordinators();
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
  editIntent(name: any, apiName: any) {
    const modalRef = this.modalService.open(AddEditCoordinatorComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    console.log("i am name", name, this.apiList)
    modalRef.componentInstance.editEntity = true;
    modalRef.componentInstance.intentName = name;
    modalRef.componentInstance.apiName = apiName;
    modalRef.componentInstance.apiList = this.apiList;
    modalRef.result.then(() => {
      // this.getCoordinators();
    });
  }
  // deleteMappedCoordinator(deleteMappedCoordinator: any) {
  //   const modalRef = this.modalService.open(DeletePopUpComponent, {
  //     size: 'l',
  //   });
  //   modalRef.componentInstance.title = 'You want To delete this entity named  ';
  //   modalRef.componentInstance.selectedName = deleteMappedCoordinator.entityName;
  //   modalRef.result.then((result) => {
  //     if (result) {
  //       this.ngxService.start()
  //       const payload = {

  //       };
  //       this.isCoordinatorService.deleteCoordinator(this.botType, this.serviceId, payload).pipe(takeUntil(this.unsubscribe)).subscribe((data: any) => {
  //         if (data['status']) {
  //           this.toastr.success(data['message']);
  //           this.ngxService.stop();
  //         } else {
  //           this.toastr.error(data['message']);
  //           this.ngxService.stop();
  //         }
  //       },
  //         (error: any) => {
  //           this.toastr.error(error.error.message);
  //           this.ngxService.stop();
  //         }
  //       )
  //     }
  //   })
  // }
  deleteMappedCoordinator(deleteMappedCoordinator: any){

  }
}


