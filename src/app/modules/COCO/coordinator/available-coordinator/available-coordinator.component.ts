import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AddEditCoordinatorComponent } from '../../add-edit-coordinator/add-edit-coordinator.component';

@Component({
  selector: 'app-available-coordinator',
  templateUrl: './available-coordinator.component.html',
  styleUrls: ['./available-coordinator.component.scss'],
})
export class AvailableCoordinatorComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<any>();
  serviceId: any;
  botType: any;
  botName: any;
  @Input() availableCoordinatorData: any;
  @Input() apiListData: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    console.log(this.availableCoordinatorData)
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  attachIntent(name: any) {
    const modalRef = this.modalService.open(AddEditCoordinatorComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.intentName = name.intentName;
    modalRef.componentInstance.apiList = this.apiListData;
    modalRef.result.then(() => {
      // this.getCoordinators();
    });
  }
  deleteCoordinator(event:any){

  }
}
