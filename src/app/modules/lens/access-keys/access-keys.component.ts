import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccessKeysService } from '../../core/services/accesskeys.service';

@Component({
  selector: 'app-access-keys',
  templateUrl: './access-keys.component.html',
  styleUrls: ['./access-keys.component.scss'],
})
export class AccessKeysComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();
  serviceID: any;
  agentID: any;
  mapAgentId: any;
  mapAccessKey: any;
  domains: any;
  domainListData: any = [];

  constructor(
    private accessKeysService: AccessKeysService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.serviceID = localStorage.getItem('lensId');
    this.agentID = localStorage.getItem('agentID');
    this.getAccessKeyData();
  }
  getAccessKeyData() {
    this.ngxService.start();
    forkJoin([
      this.accessKeysService.apiKeys(this.agentID, this.serviceID), //access key agent id api call
      this.accessKeysService.whiteListDomain(this.agentID, this.serviceID), // get white listed domain
    ])
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        ([accessKey, domainList]) => {
          this.mapAgentId = accessKey['data']['agentID'];
          this.mapAccessKey = accessKey['data']['accessKey'];
          this.domainListData = domainList['data']['whitelistedDomains'];
          this.ngxService.stop();
        },
        (error: any) => {
          this.toaster.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  addLink(data: any) {
    let pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator

    if (pattern.test(data)) {
      this.domainListData.push(data);
      if (this.domainListData) {
        const payload = {
          whitelistedDomains: this.domainListData,
          agentID: this.agentID,
        };
        console.log(payload);
        this.domains = '';
        this.ngxService.start();
        this.accessKeysService
          .addUpdateDomain(this.serviceID, payload)
          .subscribe(
            (res) => {
              if (res['status']) {
                this.toaster.success(res['message']);

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
        this.toaster.error('Please enter domain');
      }
    } else {
      this.toaster.error('Enter valid link');
    }
    return !!pattern.test(data);
  }

  onUnSelect(link: string) {
    let i = this.domainListData.indexOf(link);

    if (this.domainListData) {
      // this.domainListData.splice(i, 1);
      // console.log(this.domainListData);
      this.ngxService.start();

      const payload = {
        whitelistedDomains: [...this.domainListData],
        agentID: this.agentID,
      };

      payload['whitelistedDomains'].splice(i, 1);

      this.accessKeysService.addUpdateDomain(this.serviceID, payload).subscribe(
        (res) => {
          if (res['status']) {
            this.toaster.success(res['message']);
            this.domainListData.splice(i, 1);
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
      this.toaster.error('Please enter domain');
    }
  }
  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toaster.info('Agent Id copied to clipboard');
  }
  copyInputMessages(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toaster.info('Access key copied to clipboard');
  }
}
