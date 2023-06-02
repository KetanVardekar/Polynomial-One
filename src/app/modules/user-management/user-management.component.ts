import { error } from '@angular/compiler/src/util';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from './../core/services/organization.service';
import { takeUntil } from 'rxjs/operators';
import { UserService } from './../core/services/user.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();

  activeId: string = "";
  helpList: any
  descriptionFlag: any = {};
  searchData: any
  updatedUserName: any
  profile: any = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    country: '',
    jobTitle: '',
    displayPicture: '',
    company: '',
    userName: '',
  };
  password: any = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  settings: any = {
    language: '',
    isDesktopNotificationAllowed: '',
    isEmailNotificationAllowed: '',
  };
  activityRecords: any = [];

  editProfileFlag: boolean = true;
  hasLowerCase: boolean = false;
  hasUpperCase: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;
  isMinLength: boolean = false;
  showPassword: boolean = true;
  showPasswordNew: boolean = true;
  showPasswordConfirm: boolean = true;
  formSubmitted: boolean = true;
  public tab: any = 'profile';
  editProfile: String = 'Edit Profile';
  save: String = 'Save';
  userName: any;
  randomColor:any
  jobTitles: any = [];
  countries: any = [];
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private organizationService: OrganizationService,
    private ngxService: NgxUiLoaderService,
    private appService: AppService,
  ) {
    this.route.params.subscribe((params) => {
      this.tab = params['tabValue'];
    });
  }
  @ViewChild('textvalid')
  textvalid: ElementRef | any;
  ngOnInit(): void {
    this.randomColor = Math.floor(Math.random()*16777215).toString(16);
    this.userName = localStorage.getItem('userName');
    this.appService.setLensEvent('false');
    this.updatedUserName = localStorage.getItem('updatedUserName');
    this.appService.setISEvent('false');
    this.getActivityList();
    this.settingsDetails();
    this.getProfileDetails();
    this.getJobTitles();
    this.getCountries();
    this.helpDetails(this.searchData)
  }

  alphaOnly(event: any) {
    var key = event.keyCode;
    return (key >= 65 && key <= 90) || key == 8 || key == 32 || (key == 37 || key == 39);
  }
  numberOnly(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  //Activity
  getActivityList() {
    this.ngxService.start();
    this.userService
      .getActivityList()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.activityRecords = data['data'];
            if (this.activityRecords && this.activityRecords.length > 25) {
              this.activityRecords.length = 25;
            }
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
  //profile
  getProfileDetails() {
    this.ngxService.start();
    this.userService
      .getProfileDetails()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.profile.firstName = data['data']['firstName'];
            this.profile.lastName = data['data']['lastName'];
            this.profile.email = data['data']['email'];
            this.profile.phoneNo = data['data']['phoneNo'];
            this.profile.country = data['data']['country'];
            this.profile.jobTitle = data['data']['jobTitle'];
            this.profile.displayPicture = data['data']['displayPicture'];
            this.profile.company = data['data']['organization'];
            this.profile.userName = data['data']['userName'];
            this.cdr.detectChanges();
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
  getJobTitles() {
    this.ngxService.start();
    this.authService
      .getJobTitlesList()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          this.jobTitles = data['data'];
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
        }
      );
  }
  toggleAccordian(event: any) {
    // If it is already open you will close it and if it is closed open it
    this.activeId = this.activeId == event.panelId ? "" : event.panelId;
  }
  getCountries() {
    this.ngxService.start();
    this.authService
      .getCountries()
      .pipe(takeUntil(this.unSubscribe))
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

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file.size > 15000001) {        //Can upload image only upto 15Mb
      this.toastr.error('Image size cannot be more than 15Mb');
      // this.ngxService.stop();
      return
    }
    this.ngxService.start();
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.profile.displayPicture = reader.result;

      this.cdr.detectChanges();
    };
    this.organizationService
      .fileUpload(formData)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            // this.toastr.success(data['message']);
            this.profile.displayPicture = data['data']['url'];

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

  deleteImage() {
    this.profile.displayPicture = '';
  }

  updateProfile() {
   if (this.editProfileFlag) {
      this.ngxService.start();
      this.editProfileFlag = false;
      this.getJobTitles();
      this.getCountries();
      this.ngxService.stop();
    } else {
      if (
        this.profile.firstName &&
        this.profile.lastName &&
        this.profile.phoneNo &&
        this.profile.country &&
        this.profile.jobTitle

        // this.profile.company
      ) {
        if (this.profile.lastName.length > 49 || this.profile.firstName.length > 49) {
          return;
        }
        if (this.profile.phoneNo && this.profile.phoneNo.length != 10) {
          return;
        }
        this.ngxService.start();
        this.formSubmitted = false;

        const payload = {
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
          phoneNo: this.profile.phoneNo,
          // email:this.profile.email,
          country: this.profile.country,
          jobTitle: this.profile.jobTitle,
          displayPicture: this.profile.displayPicture,
        };
        this.userService
          .updateProfile(payload)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(
            (data) => {
              if (data['status']) {
                this.toastr.success(data['message']);
                this.editProfileFlag = true;
                localStorage.setItem('userName', this.profile.userName);
                this.updatedUserName = this.profile.firstName + " " + this.profile.lastName
                localStorage.setItem('updatedUserName', this.updatedUserName);
                this.profile.displayPicture
                  ? this.appService.setProfilePictureEvent(
                    this.profile.displayPicture
                  )
                  : this.appService.setProfilePictureEvent('');
                localStorage.setItem('profileImage', this.profile.displayPicture)
                window.location.reload();
                // this.ngxService.stop();
              } else {
                this.ngxService.stop();
              }
            },
            (error) => {
              this.toastr.error(error.error.message);
              this.ngxService.stop();
            }
          );
      } else {
        this.toastr.error('Please fill all the fields');
      }
    }
  }

  //password
  keyUpHandler = (e: any) => {
    let password = this.password.newPassword;

    //Check if password has minimum 6 characters in it
    if (this.password.newPassword.length > 7) {
      this.isMinLength = true;
    } else {
      this.isMinLength = false;
    }

    // Check if password has atleast one lower case character
    if (this.lowerCaseCheck(password)) {
      this.hasLowerCase = true;
    } else {
      this.hasLowerCase = false;
    }
    // Check if password has atleast one upper case character
    if (this.upperCaseCheck(password)) {
      this.hasUpperCase = true;
    } else {
      this.hasUpperCase = false;
    }
    // Check if password has at least one number
    const regex = /\d/;
    this.hasNumber = regex.test(password);

    //Check if password contains at least one special character
    if (/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(password)) {
      this.hasSpecialChar = true;
    } else {
      this.hasSpecialChar = false;
    }
  };

  lowerCaseCheck = (str: any) => {
    return /[a-z]/.test(str);
  };

  upperCaseCheck = (str: any) => {
    return /[A-Z]/.test(str);
  };

  changePassword() {
    if (
      this.password.oldPassword != this.password.newPassword) {

      this.ngxService.start();
      this.userService
        .changePassword(this.password)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(
          (data) => {
            if (data['status']) {
              this.toastr.success(data['message']);
              this.password = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              };
              this.hasLowerCase = false;
              this.hasUpperCase = false;
              this.hasNumber = false;
              this.hasSpecialChar = false;
              this.isMinLength = false;
              this.ngxService.stop();
            } else {
              this.ngxService.stop();
            }
          },

          (error) => {
            this.toastr.error(error.error.message);
            this.ngxService.stop();
          }
        );
    }
    else {
      this.toastr.error("New password should not be same as old password")
    }
  }
  //settings

  settingsDetails() {
    this.ngxService.start();
    this.userService
      .getSettingsDetails()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.settings.language = data['data']['language'];
            this.settings.isDesktopNotificationAllowed =
              data['data']['isDesktopNotificationAllowed'];
            this.settings.isEmailNotificationAllowed =
              data['data']['isEmailNotificationAllowed'];
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
  updateSettings() {
    this.ngxService.start();
    const payload = {
      language: '',
      isDesktopNotificationAllowed: this.settings.isDesktopNotificationAllowed,
      isEmailNotificationAllowed: this.settings.isEmailNotificationAllowed,
    };
    this.userService
      .updateSettings(payload)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
            this.appService.setDesktopNotificationEvent(this.settings.isDesktopNotificationAllowed);
            this.ngxService.stop();
          } else {
            this.ngxService.stop();
          }
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
  showHidePassword() {
    this.showPassword
      ? (this.showPassword = false)
      : (this.showPassword = true);
  }
  showHidePasswordNew() {
    this.showPasswordNew
      ? (this.showPasswordNew = false)
      : (this.showPasswordNew = true);
  }
  showHidePasswordConfirm() {
    this.showPasswordConfirm
      ? (this.showPasswordConfirm = false)
      : (this.showPasswordConfirm = true);
  }
  //Help
  helpDetails(searchData: any) {
    this.ngxService.start();
    this.userService.getHelpDetails(searchData).pipe(takeUntil(this.unSubscribe)).subscribe((res: any) => {
      if (res['status']) {
        this.helpList = res['data']
        this.helpList.forEach((element: any) => {
          element['show'] = true;
        });
        this.ngxService.stop();
      } else {
        this.ngxService.stop();
      }
    },
      (error) => {
        this.toastr.error(error.error.message);
        this.ngxService.stop();
      })
  }
  textvalidation(value?: any) {
    if (value.length > 10) {
      this.toastr.error('Please enter a valid Organization Name');
      setTimeout(() => {
        this.textvalid.nativeElement.focus();
      }, 500);
    }

  }
}
