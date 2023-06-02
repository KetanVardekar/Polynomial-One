import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { OrganizationService } from './../core/services/organization.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AnyObject } from 'chart.js/types/basic';

@Component({
  selector: 'app-add-edit-member',
  templateUrl: './add-edit-member.component.html',
  styleUrls: ['./add-edit-member.component.scss'],
})
export class AddEditMemberComponent implements OnInit, OnDestroy {
  @Input() isAdd: any;
  // @Input() isEdit :any;
  @Input() editMemberDetails: any;
  private unsubscribe = new Subject<void>();
  memberDetails: any = {
    firstName: '',
    lastName: '',
    email: '',
    platform: '',
    role: '',
    memberId: '',
  };
  platforms: any = [];
  roles: any = [];
  data: any;
  remainingArr: any;
  remainingArr1: any;
  userRole: any;
  editFlag: boolean = false;
  formSubmitted:boolean =false
  constructor(
    private organizationService: OrganizationService,
    private toastr: ToastrService,
    private activeModel: NgbActiveModal,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');

    this.getRoleList();
    this.getPlatformList();
    if (!this.isAdd) {
      this.setEditDetails();
    }
  }

  alphaOnly(event: any) {
    var key = event.keyCode;
    return (key >= 65 && key <= 90) || key == 8 || key == 32 || (key == 37 || key == 39 );
  }

  checkValidation(): any {
    if (
      this.memberDetails.firstName &&
      this.memberDetails.lastName &&
      this.memberDetails.email &&
      this.memberDetails.role
    ) {
      return false;
    }
  }

  setEditDetails() {
    console.log(this.editMemberDetails)
    this.memberDetails.firstName = this.editMemberDetails.firstName;
    this.memberDetails.lastName = this.editMemberDetails.lastName;
    this.memberDetails.email = this.editMemberDetails.email;
    this.memberDetails.roleID = this.editMemberDetails.roleID;
    this.memberDetails.role = this.editMemberDetails.role;
    this.memberDetails.memberId = this.editMemberDetails.userID;
  }

  getRoleList() {
    this.ngxService.start();
    this.organizationService
      .getRoleList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data: any) => {
          if (data['status']) {
            this.roles = data['data'];
            if (this.userRole == 'platform_admin') {
              this.remainingArr = this.roles.filter(
                (data: any) => data.displayName != 'Platform Admin',
              );

            }
            if (this.userRole == 'technical_admin') {
              this.remainingArr = this.roles.filter(
                (data: any) =>
                  data.displayName != 'Technical Admin' &&
                  data.displayName != 'Platform Admin',
              );
            }

            this.ngxService.stop();
          } else {
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.error['message']);
          this.ngxService.stop();
        }
      );
  }
  getPlatformList() {
    this.ngxService.start();
    this.organizationService
      .getPlatformList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.platforms = data['data'];
            this.ngxService.stop();
          } else {
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.error['message']);
          this.ngxService.stop();
        }
      );
  }

  addMember() {
    this.formSubmitted=true
    if (
      this.memberDetails.firstName &&
      this.memberDetails.lastName &&
      this.memberDetails.email &&
      this.memberDetails.role
    ) {
      this.ngxService.start();
      const payload = {
        firstName: this.memberDetails.firstName,
        lastName: this.memberDetails.lastName,
        email: this.memberDetails.email,
        role: this.memberDetails.role,
      };
      this.organizationService
        .addMember(payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['status']) {
              this.toastr.success(data['message']);
              this.formSubmitted=false
              this.ngxService.stop();
              this.activeModel.close();
            } else {
              this.toastr.error(data['message']);
              this.ngxService.stop();
            }
          },
          (error) => {
            this.toastr.error(error.error['message']);
            this.ngxService.stop();
          }
        );
    }
  }

  editMember() {
    this.formSubmitted=true
    if (
    (this.memberDetails.firstName.length >= 1 && this.memberDetails.firstName.length<=50 )&&
      (this.memberDetails.lastName.length >= 1 && this.memberDetails.lastName.length<=50)&&
      this.memberDetails.email &&
      this.memberDetails.role
    ) {
      this.ngxService.start();
      const payload = {
        memberID: this.memberDetails.memberId,
        firstName: this.memberDetails.firstName,
        lastName: this.memberDetails.lastName,
        role: this.memberDetails.roleID,
      };
      this.organizationService
        .editMember(payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['status']) {
              this.toastr.success(data['message']);
              this.ngxService.stop();
              this.activeModel.close();
            } else {
              this.toastr.error(data['message']);
              this.ngxService.stop();
            }
          },
          (error) => {
            this.toastr.error(error.error['message']);
            this.ngxService.stop();
          }
        );
    } else {
      this.toastr.error('Please fill all the fields');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  cancel() {
    this.activeModel.close();
  }
}
