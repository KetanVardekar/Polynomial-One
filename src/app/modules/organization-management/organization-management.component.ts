import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from './../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../core/services/organization.service';

@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.scss'],
})
export class OrganizationManagementComponent implements OnInit {
  public tab: any = 'userManagement';
  public unsubscribe: Subject<any> = new Subject();
  userMembers: any = [];
  countries: any = [];

  constructor(
    private organizationService: OrganizationService,
    private toastr: ToastrService,
    private authService: AuthService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.getUserMembers();
    this.getCountries();
  }

  getCountries() {
    this.ngxService.start();
    this.authService
      .getCountries()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          this.countries = data['data'];
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
        }
      );
  }

  getUserMembers() {
    this.ngxService.start();
    this.organizationService
      .getUserMembers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.userMembers = data['data']['list'];
            this.userMembers.map((obj: any) => ({ ...obj, isSelect: 'false' }));
            this.ngxService.stop();
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
