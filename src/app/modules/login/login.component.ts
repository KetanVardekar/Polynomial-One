import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  editProfileFlag: boolean = true;
  hasLowerCase: boolean = false;
  hasUpperCase: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;
  isMinLength: boolean = false;
  password: any = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  // showPassword: boolean = false;

  private unsubscribe = new Subject<void>();
  hostName: any;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private appService: AppService
  ) {
    this.activatedRoute.url.subscribe((res) => {
      console.log(res);
      if (res[1].path == 'verifyMail') {
        this.activatedRoute.queryParams.subscribe((params) => {
          console.log(params);
          if (params.auth) {
            this.ngxService.start();
            const payload = {
              paramsData: params.auth,
            };
            this.authService
              .verifyEmailFormUrl(payload)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(
                (data) => {
                  this.loginModuleFlag = true;
                  this.loginEmailFlag = true;
                  this.ngxService.stop();
                  // this.emailVarifiedSuccessFlag = true;
                  this.toastr.success(data['message']);
                },
                (error) => {
                  this.ngxService.stop();
                }
              );
          }
        });
      } else if (res[1].path == 'reset') {
        this.activatedRoute.queryParams.subscribe((params) => {
          console.log(params);
          if (params.auth) {
            this.resetPasswordParam = params.auth;
          }
        });
        this.loginEmailFlag = false;
        this.resetPasswordScreenFlag = true;
        this.forgetPasseordScreenFlag = false;
      } else if (res[1].path == 'signup') {
        this.ngxService.start();
        this.activatedRoute.queryParams.subscribe((params) => {
          if (params.auth) {
            this.getJobTitleAndCountriesList()
            const payload = {
              paramsData: params.auth,
            };
            this.authService
              .signupVerification(payload)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(
                (data) => {
                  this.userId = data.data.userID;
                  this.registrationForm.patchValue({
                    firstName: data.data.firstName,
                    lastName: data.data.lastName,
                    companyEmail: data.data.email,
                    jobTitle: data.data.jobTitle,
                    phone: data.data.phoneNo,
                    country: data.data.country,
                    organizationId: data.data.organization,
                  });
                  this.getCompanyEmail();
                  this.loginModuleFlag = false;
                  this.loginEmailFlag = false;
                  this.registrationFlag = true;
                  this.ngxService.stop();
                },
                (error) => {
                  this.ngxService.stop();
                }
              );
          }
        });
      }
    });
  }

  jobTitles = [];
  countries = [];

  loginEmailFlag: boolean = true;
  loginPasswordFlag: boolean = false;
  forgetPasseordScreenFlag: boolean = false;
  resetPasswordScreenFlag: boolean = false;
  resetPasswordSuccessFlag: boolean = false;
  resetPasswordButtonFlag: boolean = true;
  loginModuleFlag: boolean = true;
  registrationFlag: boolean = false;
  registerOrganizationFlag: boolean = false;
  emailVarifiedSuccessFlag: boolean = false;
  showPassword: boolean = false;

  tab: string = 'Login'; //Login, About Us
  orgIcon: any;
  orgName: any;
  emailVerified: boolean = false;
  verificationForm: FormGroup | any;
  authenticationForm: FormGroup | any;
  forgotPasswordEmailForm: FormGroup | any;
  resetPasswordForm: FormGroup | any;
  registrationForm: FormGroup | any;
  registrationOrganizationForm: FormGroup | any;
  resetPasswordParam: any;
  userId: any;

  @ViewChild('passwordInput')
  passwordInput: ElementRef | any;

  @ViewChild('emailInput')
  emailInput: ElementRef | any;

  @ViewChild('backButton')
  backButton: ElementRef | any;

  @ViewChild('loginButton')
  loginButton: ElementRef | any;

  @ViewChild('forgetEmailInput')
  forgetEmailInput: ElementRef | any;

  @ViewChild('newPasswordInput')
  newPasswordInput: ElementRef | any;

  @ViewChild('confirmPasswordInput')
  confirmPasswordInput: ElementRef | any;

  @ViewChild('resetButton')
  resetButton: ElementRef | any;

  @ViewChild('firstName')
  firstName: ElementRef | any;

  @ViewChild('lastName')
  lastName: ElementRef | any;

  @ViewChild('companyEmail')
  companyEmail: ElementRef | any;

  @ViewChild('jobTitle')
  jobTitle: ElementRef | any;

  @ViewChild('phone')
  phone: ElementRef | any;

  @ViewChild('country')
  country: ElementRef | any;

  @ViewChild('confirmButton')
  confirmButton: ElementRef | any;

  ngOnInit(): void {
    this.verificationForm = this.formBuilder.group({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
    });

    this.forgotPasswordEmailForm = this.formBuilder.group({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
    });
    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.authenticationForm = this.formBuilder.group({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    //intialize registration form
    this.registrationForm = this.formBuilder.group({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      companyEmail: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
      companyName: new FormControl(null),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      jobTitle: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/),
      ]),
      country: new FormControl(null, [Validators.required]),
      termsAndConditions: new FormControl(false, [Validators.required]),
      organizationId: new FormControl(null),
    });

    //intialize registration organization form
    this.registrationOrganizationForm = this.formBuilder.group({
      organizationName: new FormControl(null, [Validators.required, Validators.maxLength(128)]),
      organizationAddress: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      country: new FormControl(null, [Validators.required]),
      techAdminName: new FormControl(null, [Validators.required]),
      techAdminEmail: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.pattern(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
        ),
      ]),
      techAdminPhone: new FormControl(null, [Validators.required]),
      techAdminPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      termsAndConditions: new FormControl(false, [Validators.required]),
    });

    // Set focus to email input
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 500);

  }

  alphaOnly(event: any) {
    var key = event.keyCode;
    return (key >= 65 && key <= 90) || key == 8 || key == 32 || (key == 37 || key == 39 ) ;
  }

  numberOnly(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  validatePhoneNo(value?: any) {
    if (value) {
      if (
        this.registrationOrganizationForm.get('techAdminPhone').errors.pattern
      ) {
        this.toastr.error('Please enter a valid Contact Number');
      }
    } else {
      if (this.registrationForm.get('phone').errors.pattern) {
        this.toastr.error('Please enter a valid Contact Number');
      }
    }
  }

  emailValidation(value?: any) {
    if (value) {
      if (
        this.registrationOrganizationForm.get('techAdminEmail').errors.pattern
      ) {
        this.toastr.error('Please enter a valid email address');
      }
    } else {
      if (this.registrationForm.get('companyEmail').errors.pattern) {
        this.toastr.error('Please enter a valid email address');
      }
    }
  }

  verifyEmail = () => {
    this.ngxService.start();
    if (this.verificationForm.status === 'VALID') {
      localStorage.clear();
      sessionStorage.clear();
      const payload = this.verificationForm.value;

      this.authService.verifyEmail(payload).subscribe(
        (data) => {
          this.orgIcon = data.data.image;
          this.orgName = data.data.name;
          this.emailVerified = true;
          this.loginEmailFlag = false;
          this.loginPasswordFlag = true;
          this.authenticationForm.get('password').setValue('');
          this.cdr.detectChanges();
          this.ngxService.stop();
          setTimeout(() => {
            this.passwordInput.nativeElement.focus();
          }, 500);
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
    }
  };

  login() {
    localStorage.clear();
    this.ngxService.start();
    if (
      this.verificationForm.status === 'VALID' &&
      this.authenticationForm.status === 'VALID'
    ) {
      const payload = {
        email: this.verificationForm.value.email,
        password: this.authenticationForm.value.password,
      };

      this.authService
        .signIn(payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['data']) {
              console.log(data)
              localStorage.setItem('updatedUserName',data.data.userInfo.firstName + " " + data.data.userInfo.lastName );
              localStorage.setItem('token', data.data.accessToken);
              localStorage.setItem('userName', data.data.userInfo.userName);
              localStorage.setItem('email', this.verificationForm.value.email);
              localStorage.setItem(
                'organization',
                data.data.userInfo.organization
              );
              if (data['data'].userInfo.displayPicture) {
                localStorage.setItem(
                  'profileImage',
                  data['data'].userInfo.displayPicture
                );
              }
              if (this.orgIcon) {
                localStorage.setItem('orgIcon', this.orgIcon);
              }
              localStorage.setItem('role', data.data.userInfo.role);
              localStorage.setItem('userID', data.data.userInfo.userID);
              this.ngxService.stop();
              this.router.navigate(['/home']);
            } else {
              this.toastr.error('Something went wrong');
              this.ngxService.stop();
            }
          },
          (error) => {
            this.toastr.error(error.error.message);
            this.ngxService.stop();
          }
        );
    } else {
      this.ngxService.stop();
    }
  }

  keyDownHandler = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.loginButton.nativeElement.click();
    }
  };
  confirmEvent=(e:any)=>{
    if (e.key === 'Enter') {
      e.preventDefault();
      this.confirmButton.nativeElement.click();
    }
  }
  //show forget password screen and hide password screen
  showForgetpasswordScreen() {
    this.loginPasswordFlag = false;
    this.forgetPasseordScreenFlag = true;
    this.emailVerified = false;
  }

  //forget password
  forgotPassword() {
    this.ngxService.start();
    const payload = {
      email: this.forgotPasswordEmailForm.value.email,
    };
    this.authService
      .forgetPassword(payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.loginModuleFlag = true;
            this.loginEmailFlag = true;
            this.forgetPasseordScreenFlag = false;
            this.ngxService.stop();
            this.toastr.success(data['message']);
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

  showHidePassword() {
    this.showPassword
      ? (this.showPassword = false)
      : (this.showPassword = true);
  }

  //check password and confirm password are same or not
  checkConfirmPassword() {
    this.resetPasswordForm.value.password ===
      this.resetPasswordForm.value.confirmPassword
      ? !this.resetPasswordForm.status
        ? (this.resetPasswordButtonFlag = false)
        : (this.resetPasswordButtonFlag = false)
      : (this.resetPasswordButtonFlag = true);
  }

  //reset Password and enable reset password success screen
  resetPassword() {
    this.ngxService.start();
    const payload = {
      paramsData: this.resetPasswordParam,
      newPassword: this.resetPasswordForm.value.password,
      confirmPassword: this.resetPasswordForm.value.confirmPassword,
    };
    this.authService
      .resetPassword(payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          this.resetPasswordScreenFlag = false;
          this.loginEmailFlag = true;
          this.loginModuleFlag = true;
          this.emailVerified = false;
          this.toastr.success(data['message']);

          this.cdr.detectChanges();
          this.ngxService.stop();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  //redirect to login page from reset password success screen
  redirectToLogIn() {
    this.emailVarifiedSuccessFlag = false;
    this.resetPasswordSuccessFlag = false;
    this.loginEmailFlag = true;
  }

  redirectToPasswordScreen() {
    this.forgetPasseordScreenFlag = false;
    this.loginPasswordFlag = true;
  }
  showRegistrationModule() {
    this.ngxService.start();
    //disable login view and enable registration view
    this.loginModuleFlag = false;
    this.registrationFlag = true;
    this.getJobTitleAndCountriesList();
  }

  getJobTitleAndCountriesList() {
    forkJoin([
      this.authService.getJobTitlesList(),
      this.authService.getCountries()
    ]).pipe(takeUntil(this.unsubscribe))
      .subscribe(([data, countryData]) => {
        this.jobTitles = data['data'];
        this.countries = countryData['data'];
        this.ngxService.stop();
      }, error => {
        this.ngxService.stop();
      });
  }

  getCompanyEmail() {
    this.ngxService.start();
    const payload = {
      email: this.registrationForm.value.companyEmail,
    };
    this.authService
      .getCompanyName(payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {

          if (data['success']) {

            this.registrationForm.patchValue({
              companyName: data['data'].name,
              organizationId: data['data'].orgID,
            });

            this.ngxService.stop();
          } else {
            console.log(data)
            this.toastr.error(data.data['message']);
            this.ngxService.stop();
          }
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  registerUser() {
    this.ngxService.start();
    if (this.registrationForm.status === 'VALID') {
      const payload = {
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        email: this.registrationForm.value.companyEmail,
        phoneNo: this.registrationForm.value.phone,
        organization: this.registrationForm.value.organizationId,
        country: this.registrationForm.value.country,
        jobTitle: this.registrationForm.value.jobTitle,
        password: this.registrationForm.value.password,
        userID: this.userId
      };
      this.authService
        .userSignup(payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['success']) {
              this.toastr.success(data['message']);
              this.loginEmailFlag = true;
              this.loginModuleFlag = true;
              this.registrationFlag = false;
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
    } else {
      this.ngxService.stop();
    }
  }

  registerOrganization() {
    this.ngxService.start();
    if (this.registrationOrganizationForm.status == 'VALID') {
      const payload = {
        name: this.registrationOrganizationForm.value.organizationName,
        address: this.registrationOrganizationForm.value.organizationAddress,
        adminName: this.registrationOrganizationForm.value.techAdminName,
        email: this.registrationOrganizationForm.value.techAdminEmail,
        phoneNo: this.registrationOrganizationForm.value.techAdminPhone,
        country: this.registrationOrganizationForm.value.country,
        password: this.registrationOrganizationForm.value.techAdminPassword,
      };
      this.authService
        .organizationSignup(payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['status']) {
              this.toastr.success(data['message']);
              this.loginEmailFlag = true;
              this.loginModuleFlag = true;
              this.registerOrganizationFlag = false;
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
    } else {
      this.ngxService.stop();
    }
  }

  showRegisterOrganization() {
    this.registrationFlag = false;
    this.registerOrganizationFlag = true;
    window.scrollTo(0, 0);
  }
  showHidePasswordConfirm(){
  this.showPassword
  ? (this.showPassword = false)
  : (this.showPassword = true);
  }
  showRegister() {
    this.registrationFlag = true;
    this.registerOrganizationFlag = false;
    window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
