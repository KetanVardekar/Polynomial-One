import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Inject, } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { OrganizationService } from '../../core/services/organization.service';
import { AuthService } from '../../core/services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DOCUMENT } from '@angular/common';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'app-organization-detail-update',
  templateUrl: './organization-detail-update.component.html',
  styleUrls: ['./organization-detail-update.component.scss'],
})
export class OrganizationDetailUpdateComponent implements OnInit {
  public unsubscribe: Subject<any> = new Subject();
  organizationNotUpdate: boolean = true;
  orgName:any
  randomColor :any
  orgIcon: any = '';
  formSubmitted: boolean = true;
  imageError: any
  organizationDetails: any = {
    organizationName: '',
    websiteLink: '',
    organizationAddress: '',
    organizationCountry: '',
    image: '',
    organizationId: '',

  };

  countries: any = [];
  userName: any = '';
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ngxService: NgxUiLoaderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private organizationService: OrganizationService,
    private appService: AppService,
  ) {

  }
  @ViewChild('textvalid')
  textvalid: ElementRef | any;

  ngOnInit(): void {

    this.orgIcon = localStorage.getItem('profileImage')

    this.userName = localStorage.getItem('userName');
    this.orgName =localStorage.getItem("organization")
    this.getCountries();
    this.fetchOrganizationData();
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
  alphaOnly(event: any) {
    var key = event.keyCode;
    return (key >= 65 && key <= 90) || key == 8 || key == 32 || (key == 37 || key == 39 );
  }
  textvalidation(value?: any) {
    // if (value.length < 3 || value.length > 50) {
    //   this.toastr.error('Please enter a valid Organization Name');
    //   setTimeout(() => {
    //     this.textvalid.nativeElement.focus();
    //   }, 500);
    // }

  }
  gotourl(){
    if(this.organizationDetails.websiteLink==""){
      return
    }else{
    window.open(this.organizationDetails.websiteLink, '_blank');
    }
  }
  omitSpecialChar(e: any) {
    var k;
    document.all ? (k = e.keyCode) : (k = e.which);
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

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
      this.organizationDetails.image = reader.result;
      this.cdr.detectChanges();
    };
    this.organizationService
      .fileUpload(formData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {

          if (data['status']) {
            this.organizationDetails.image = data['data']['url'];
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
  deleteImage() {
    this.organizationDetails.image = '';
  }
  fetchOrganizationData() {
    this.ngxService.start();
    this.organizationService
      .fetchOrganizationData()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.organizationDetails.organizationName = data['data']['name'];

            this.organizationDetails.image = data['data']['image'];
            this.organizationDetails.organizationCountry =
              data['data']['country'];
            this.organizationDetails.organizationAddress =
              data['data']['address'];
            this.organizationDetails.websiteLink = data['data']['websiteLink'];
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
  updateOrganization() {

    if
      (this.organizationDetails.organizationName &&
      this.organizationDetails.organizationAddress &&
      this.organizationDetails.organizationCountry &&
      this.organizationDetails.websiteLink
    ) {
      if(this.organizationDetails.organizationName.length >= 129){
        return;
      }
      if(this.organizationDetails.organizationAddress.length >= 501){
        return;
      }
      this.ngxService.start();
      const payload = {
        name: this.organizationDetails.organizationName,
        address: this.organizationDetails.organizationAddress,
        websiteLink: this.organizationDetails.websiteLink,
        country: this.organizationDetails.organizationCountry,
        image: this.organizationDetails.image,
      };
      this.organizationService
        .updateOrganization(payload)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data) => {
            if (data['status']) {
              this.toastr.success(data['message']);
              this.organizationNotUpdate = true;
              this.organizationDetails.image
              ? this.appService.setOrgPictureEvent(
                this.organizationDetails.image
              )
              : this.appService.setOrgPictureEvent('');
              localStorage.setItem('orgIcon',this.organizationDetails.image);
              this.formSubmitted = false

              // window.location.reload();
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
    else {
      this.toastr.error('Please fill all the fields correctly');
      return;
      // setTimeout(() => {
      //   this.textvalid.nativeElement.focus();
      // }, 500);

    }
  }
  onClick(event:any){
    window.open(event,'_blank')
  }
}
