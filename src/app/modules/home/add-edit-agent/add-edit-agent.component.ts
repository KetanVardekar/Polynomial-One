import { OrganizationService } from './../../core/services/organization.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HomeService } from './../../core/services/home.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgModel } from '@angular/forms';
import { CreateSuccessPopupComponent } from '../create-success-popup/create-success-popup.component';
import { BotService } from '../../core/services/bot.service';

@Component({
  selector: 'app-add-edit-agent',
  templateUrl: './add-edit-agent.component.html',
  styleUrls: ['./add-edit-agent.component.scss'],
})
export class AddEditAgentComponent implements OnInit {

  @Input() addAgent: any;
  @Input() editAgent: any;
  @Input() serviceId: any;
  @Input() botServiceId: any;
  @Input() agentId: any;
  @Input() key: any;
  @Input() agentName: any;
  @Input() selectedBot: any = {

  }
  public unsubscribe = new Subject<void>();
  selectKit: any
  kitList: any = [];
  teamList: any = [];

  userName: any;
  agent: any
  cocoAgent: any = {
    npl: '',
    name: '',
    colorHex: '',
    data: '',
  };

  agentDetails: any = {
    kit: '',
    agentName: '',
    team: null,
    description: '',
    image: '',
    kitId: '',
    agentId: '',
    isActive: '',
  };
  constructor(
    private botService: BotService,
    private homeService: HomeService,
    private ngxService: NgxUiLoaderService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private organizationService: OrganizationService
  ) { }

  ngOnInit(): void {
    if (this.agentName) {
      this.agent = this.agentName.charAt(0).toUpperCase()
    }
    if (this.selectedBot) {
      this.cocoAgent.name = this.selectedBot.displayName;
      this.cocoAgent.agentType = this.selectedBot.botType;
      this.agentDetails.description = this.selectedBot.description;
      this.agentDetails.image = this.selectedBot.avatarUri
    }
    this.userName = localStorage.getItem('userName');
    this.serviceId = localStorage.getItem('lensId');
    this.botServiceId = localStorage.getItem('ISId');
    this.getKitAndTeanList();
    if (this.editAgent) {
      this.getAgentInfo();
    }

    this.agentDetails.key = this.key;
    this.agentDetails.kit = this.key;
  }

  getKitAndTeanList() {
    this.ngxService.start();
    forkJoin([
      this.homeService.getKits(this.serviceId), //kit list
      this.homeService.getTeams(this.serviceId), //team list
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([response1, response2]) => {
          this.kitList = response1['data']['kits'];
          this.teamList = response2['data']['teams'];
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error['message']);
        }
      );
  }
  getAgentInfo() {
    this.ngxService.start();
    this.homeService
      .getAgentDetails(this.agentId, this.serviceId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          let agentInfo = data['data']['agent'];
          this.agentDetails.agentName = agentInfo.name;
          this.agentDetails.kit = agentInfo.kitID;
          this.agentDetails.team = agentInfo.teamID;
          this.agentDetails.description = agentInfo.description;
          this.agentDetails.image = agentInfo.imageURL;
          this.agentDetails.isActive = agentInfo.isActive;
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
        }
      );
  }
  // uploadFile(event:any){}

  uploadImage(event: any) {
    this.ngxService.start();
    const file = event.target.files[0];
    if (file.size > 15000001) {        //Can upload image only upto 15Mb
      this.toastr.error('Image size cannot be more than 15Mb');
      this.ngxService.stop();
      return
    }
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.agentDetails.image = reader.result;

      this.cdr.detectChanges();
    };
    this.organizationService
      .fileUpload(formData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
            this.agentDetails.image = data['data']['url'];

            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error['message']);
        }
      );
  }
  deleteImage() {
    this.agentDetails.image = '';
  }
  addMember() {
    if (this.cocoAgent.name.length >= 16) {
      return
    }
    if (
      this.cocoAgent.name && this.agentDetails.description
    ) {
      this.ngxService.start();
      const payload: any = {
        serviceID: this.botServiceId ? this.botServiceId : null,
        name: this.cocoAgent.name,
        description: this.agentDetails.description,
        agentLogo: this.agentDetails.image,
        colorHex: this.agentDetails.colorHex?this.agentDetails.colorHex.slice(1):'000',
        isActive: this.agentDetails.isActive
          ? this.agentDetails.isActive
          : false,
      };
      this.botService.createBot(payload).pipe(takeUntil(this.unsubscribe)).subscribe(
        data => {
          this.activeModal.close('true');
          if (!this.editAgent) {
            if (data.status) {
              const modalRef = this.modalService.open(CreateSuccessPopupComponent, {
                size: 'lg',
                animation: true,
                backdrop: 'static',
                keyboard: false,
              });
              modalRef.componentInstance.addAgent = true;
            }
          }
          this.ngxService.stop()
        },
        error => {
          console.log(error)
        }
      )
    } else {
      this.toastr.error('Please fill all the fields');
      return;
    }
  }

  editMember() {
    if (this.agentDetails.agentName.length >= 16) {
      return
    }
    if (
      this.agentDetails.kit &&
      this.agentDetails.agentName
    ) {
      const payload: any = {
        serviceID: this.serviceId ? this.serviceId : null,
        kitID: this.agentDetails.kit,
        name: this.agentDetails.agentName,
        teamID: "6194e500b83d88df9b7cc377",
        description: this.agentDetails.description,
        logo: this.agentDetails.image,
        isActive: this.agentDetails.isActive
          ? this.agentDetails.isActive
          : false,
      };
      this.agentId ? (payload['agentID'] = this.agentId) : null;
      this.homeService
        .createAgents(payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['status']) {
              this.ngxService.stop();
              this.activeModal.close('true');
              if (!this.editAgent) {
                const modalRef = this.modalService.open(
                  CreateSuccessPopupComponent,
                  {
                    size: 'lg',
                    animation: true,
                    backdrop: 'static',
                    keyboard: false,
                  }
                );
              }
            } else {
              this.ngxService.stop();
              this.toastr.error(data['message']);
            }
          },
          (error) => {
            this.ngxService.stop();
            this.toastr.error(error.error['message']);
          }
        );
    } else {
      this.toastr.error('Please fill all the fields');
      return;
    }
  }
  changeEvent(data: any) {
    if (data == '6180bdcfc7dd291d592f391b') {
      this.selectKit = 'N'
    } else {
      this.selectKit = 'M'
    }
  }
  close() {
    this.activeModal.close();
  }
  uploadFile(event: any) {
    this.ngxService.start();
    event.value = '';
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.cocoAgent.data = reader.result;
      this.cdr.detectChanges();
    };
    this.organizationService
      .fileUpload(formData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
            this.cocoAgent.data = data['data']['url'];
            this.ngxService.stop();
          } else {
            this.toastr.error(data['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.ngxService.stop();
        }
      );
  }
}
