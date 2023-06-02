import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurePopUpComponent } from '../configure-pop-up/configure-pop-up.component';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss'],
})
export class CreateChannelComponent implements OnInit {
  // @Output() configure = new EventEmitter<any>();
  @Input() createChannelData: any;

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void { }
  // configureSelect() {
  //   this.configure.emit(true);
  // }
  configure(id: any) {

    if (id == 0 || id == 1) {
      const modalRef = this.modalService.open(ConfigurePopUpComponent, {
        size: 'lg',
        // animation: true,
        // backdrop: 'static',
        // keyboard: false,
      });
      modalRef.componentInstance.selectedName =this.createChannelData
      switch (id) {
        case 0:
          modalRef.componentInstance.showWhatsapp = true;
          modalRef.componentInstance.whatsapp =this.createChannelData[0].name
          break;
        case 1:
          modalRef.componentInstance.showSlack = true;
          modalRef.componentInstance.slack =this.createChannelData[1].name
          break;
      }
    }
  }
}
