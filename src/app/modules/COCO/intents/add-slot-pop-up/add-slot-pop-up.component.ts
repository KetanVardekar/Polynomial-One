import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISIntentsService } from 'src/app/modules/core/services/IS/ISintents.service';

@Component({
  selector: 'app-add-slot-pop-up',
  templateUrl: './add-slot-pop-up.component.html',
  styleUrls: ['./add-slot-pop-up.component.scss']
})
export class AddSlotPopUpComponent implements OnInit {
  // @Output() slotData = new EventEmitter<any>();
  @Input() selctedSlot: any;
  public unsubscribe = new Subject<any>();
  slotList: any = [];
  slotSelected: any = [];
  botType: any;
  serviceId: any;
  slotName: any;
  formSubmitted: boolean = true;
  constructor(
    private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isIntentsService: ISIntentsService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
    this.getSlotList();
    if (this.selctedSlot && this.selctedSlot.length) {
      this.slotName = this.selctedSlot;
    }
  }
  getSlotList() {
    this.ngxService.start();
    this.isIntentsService
      .getSlotList('', this.botType, this.serviceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.slotList = data['data'];
            this.cdr.detectChanges();
            this.ngxService.stop();
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
  addSlot() {

    this.slotSelected = this.slotName;
    // this.slotData.emit(this.slotSelected)
    if (this.slotSelected.length == 0) {
      return
    } else {
      this.activeModal.close(this.slotSelected);
    }
  }
  close() {
    this.activeModal.close();
  }
}
