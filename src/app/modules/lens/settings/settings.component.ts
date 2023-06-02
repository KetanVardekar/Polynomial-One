import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HomeService } from '../../core/services/home.service';
import { LensSettingsService } from '../../core/services/lens/LensSettings.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationService } from '../../core/services/organization.service';
import { AppService } from 'src/app/app.service';
import { resolveModuleName } from 'typescript';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public unsubscribe: Subject<any> = new Subject();
  name: any;
  select: any;
  deleteList: any;
  profilePicture: any;
  agentDetails: any;
  image: any;
  Description: any;

  agentID: any;
  payload: any;

  @Input() serviceId: any;
  lensId: any = [];
  teamList: any = [];
  editFlag: boolean = true;

  event: any;
  agentList: any;
  editIconFlag: boolean = true;
  settingsNotUpdate: boolean = true;
  userName: any;
  isActive: any;
  teamID: any;
  constructor(
    private homeservice: HomeService,
    private lensSettingsService: LensSettingsService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    private organizationService: OrganizationService,
    private appService:AppService
  ) {}

  ngOnInit(): void {
    this.getAndSetAttribute();
    this.setData();
    this.data();
  }
  getAndSetAttribute() {
    this.serviceId = localStorage.getItem('lensId');
    this.agentID = localStorage.getItem('agentID');
    this.profilePicture = localStorage.getItem('profileImage');
    let agentDetail: any = localStorage.getItem('agentDetails');
    this.userName = JSON.parse(agentDetail).name;
  }
  data() {
    this.ngxService.start();
    forkJoin([
      this.homeservice.getTeams(this.serviceId), //get teams
      this.lensSettingsService.getAgentSettings(this.agentID, this.serviceId), //get agent
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([teamData, agentData]) => {
          if (teamData['status']) {
            this.teamList = teamData['data']['teams'];
            this.agentList = agentData['data']['agent'];
            this.ngxService.stop();
          } else {
            this.toaster.error(teamData['message']);
            this.toaster.error(agentData['message']);
            this.ngxService.stop();
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }
  uploadImage(event: any) {
    this.ngxService.start();

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.image = reader.result;

      this.cdr.detectChanges();
    };
    this.organizationService
      .fileUpload(formData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data: any) => {
          if (data['status']) {
            // this.toaster.info(data['message']);
            this.image = data['data']['url'];

            this.ngxService.stop();
          } else {
            this.toaster.error(data['message']);
            this.ngxService.stop();
          }
        },
        (err: any) => {
          this.toaster.error(err.error.message);
          this.ngxService.stop();
        }
      );
  }
  setData() {
    this.agentDetails = localStorage.getItem('agentDetails');
    let agentdata = JSON.parse(this.agentDetails);

    this.name = agentdata.name;
    this.select = agentdata.teamID;
    this.Description = agentdata.description;
    this.image = agentdata.imageURL;
  }

  canEdit() {
    this.editFlag = false;
    this.editIconFlag = false;
  }
  deleteImage() {
    this.image = '';
  }

  canUpdate() {
    if (this.name && this.select && this.Description) {
      const payload = {
        id: this.agentID,
        agentName: this.name,
        description: this.Description,
        imageURL: this.image,
        isActive: true,
        teamID: this.select,
      };

      this.ngxService.start();
      this.lensSettingsService
        .editAgentSettings(this.agentID, this.serviceId, payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (res) => {
            if (res['status']) {
              this.toaster.success(res['message']);
              this.editFlag = true;
              this.editIconFlag = true;
              this.settingsNotUpdate = true;
             this.image
                  ? this.appService.setLensProfilePictureEvent(
                    this.image
                  )
                  : this.appService.setLensProfilePictureEvent('');
                  localStorage.setItem('lensProfileImage', this.image)
              this.ngxService.stop();
            } else {
              this.toaster.error(res['message']);
              this.ngxService.stop();
            }
          },
          (err) => {
            this.toaster.error(err.error.message);
            this.ngxService.stop();
          }
        );
    } else {
      this.toaster.error('Please fill all the fields');
    }
  }
}
