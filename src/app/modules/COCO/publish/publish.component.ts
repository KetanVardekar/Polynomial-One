import { ISIntegrationsService } from './../../core/services/IS/ISintegrations.service';
import { ISIntentsService } from './../../core/services/IS/ISintents.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISPublishService } from '../../core/services/IS/ISpublish.service';
import { of } from 'rxjs';

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { forkJoin, Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(
          ':enter',
          stagger(100, [
            animate(
              '.3s ease-out',
              keyframes([
                style({ opacity: 0, transform: 'translateY(60px)' }),
                style({ opacity: 1, transform: 'translateY(0)' }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class PublishComponent implements OnInit, OnDestroy {
  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement
    }
  }
  public unsubscribe = new Subject<any>();

  myFileName = 'dummyFile';
  serviceID: any;
  botType: any;
  userName: any;
  botUrl: any
  public tab: any = 'ready';

  integratedAPICount: number = 0;
  intentCount: number = 0;
  versionNumber: number = 0;

  selectedIntent: any = [];

  embdScript: string = ''; //Embeddable script

  // checkAllIntents: boolean = false; //checkbox to select all valid intents for publish
  totalValidIntents: number = 0; //total (valid) publishable intents
  // totalSelectedIntents: number = 0; //total intents where checkbox is selected

  readyToPublishList: any = [];
  publishHistory: any = [];

  constructor(
    private ispublishservice: ISPublishService,
    private ngxService: NgxUiLoaderService,
    private isIntegrationService: ISIntegrationsService,
    private isIntentService: ISIntentsService,
    private toastr: ToastrService,



  ) { }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceID = localStorage.getItem('ISId');
    this.userName = localStorage.getItem('userName');

    this.ngxService.start();
    // this.getBotStatuslist();
    // this.getBotHistory();
    // this.getBotVersion();
    // this.getembedurl();
    // this.getfetchintenttopublish();
    // this.torestore();
    this.getAllDetails();
  }
  getAllDetails() {
    this.ngxService.start();
    forkJoin([
      this.ispublishservice.botHistory(this.botType, this.serviceID), //Publish history
      this.ispublishservice.botVersion(this.botType, this.serviceID), //Bot version
      this.ispublishservice.fetchIntentToPublish(this.botType, this.serviceID), //Intent to publish
      this.isIntegrationService.getAPIList(this.botType, '', this.serviceID), //Integration API Count
      this.isIntentService.getIntentList(0, '', this.botType, this.serviceID), //Intent to Count
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        ([history, version, intent, integration, intentCount]) => {
          this.publishHistory = history['data'];
          this.versionNumber = version['data']['version'];
          // this.readyToPublishList = intent['data'];
          this.integratedAPICount = integration['data'].length;
          this.intentCount = intentCount['data'].length;
          let publishIntents = intent['data'].map((intent: any) => {
            intent.status = '-';
            if (intent.isValid) {
              this.totalValidIntents++;
              intent.status = 'Ready to publish';
            } else if (intent.invalidItems.length > 0) {
              intent.status = `Invalid`;
            }
            if (
              intent.updatedItems.length === 0 &&
              intent.invalidItems.length === 0
            ) {
              intent.status = 'Up-to-date';
            }
            intent.time = new Date(intent.time);
            intent.invalidItems = intent.invalidItems.join(', ');
            return intent;
          });
          this.readyToPublishList = publishIntents;
          this.readyToPublishList.forEach((ele: any) => {
            ele['checked'] = false;
          });
          this.ngxService.stop();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  // fakeValidateUserData() {
  //   return of("ffgtgtgtgt");
  // }
  // private dyanmicDownloadByHtmlTag(arg: {
  //   fileName: string,
  //   text: string
  // }) {
  //   if (!this.setting.element.dynamicDownload) {
  //     this.setting.element.dynamicDownload = document.createElement('a');
  //   }
  //   const element = this.setting.element.dynamicDownload;
  //   const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
  //   element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
  //   element.setAttribute('download', arg.fileName);

  //   var event = new MouseEvent("click");
  //   element.dispatchEvent(event);
  // }

  // dynamicDownloadTxt() {
  //   this.fakeValidateUserData().subscribe((res:any) => {
  //     this.dyanmicDownloadByHtmlTag({
  //       fileName: 'My Report.html',
  //       text: JSON.stringify(res)
  //     });
  //   });

  // }

  getBotStatusList() {
    this.ngxService.start();
    this.ispublishservice
      .getBotStatus(this.botType, this.serviceID)
      .subscribe((res) => { });
    this.ngxService.stop();
  }
  getBotHistory() {
    this.ispublishservice
      .botHistory(this.botType, this.serviceID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.publishHistory = data['data'];
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
  getBotVersion() {
    this.ngxService.start();
    this.ispublishservice
      .botVersion(this.botType, this.serviceID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
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
  getEmbedUrl() {
    this.ngxService.start();
    let avatarURI = '';
    this.ispublishservice
      .getEmbedUrl(this.botType, this.serviceID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {

          if (data['status']) {
            this.botUrl = data.data[0].url
            console.log(this.botUrl)

            let botType = new URL(data.data[0].url).searchParams.get('botType');
            console.log(botType)

           let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>@import 'https://gist.github.com/p3t3r67x0/ac9d052595b406d5a5c1.js'; .b-cls{mso-border-alt:basic-black-dashes; mso-border-between-width:thick;}</style></head><body>";
          let postHtml = "</body></html>";

          this.embdScript = `<script src="https://coliveshona.blob.core.windows.net/coliveshonabot/bot-script.js" id="polynomial-bot" logo-url="${avatarURI}" bot-id="${botType}" popuptime="4" start-time="00:00" end-time="23:59"></script>`;
          let html = preHtml+this.embdScript+postHtml;

            // this.botService.getBotAvatarURI.subscribe(
            //   data => {
            //     if (data && Object.keys(data).length === 0 && data.constructor === Object) {//if blank
            //       avatarURI = "";
            //     } else {
            //       avatarURI = data;
            //     }
            //     console.log(data);
            //   },
            //   error => {
            //     console.log(error);
            //   }
            // );


            // downloadHTML(this.embdScript)
            this.toastr.success(data['message']);
            this.ngxService.stop();
          }
          else {
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
  downloadHTML(script:any){
    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([
    //   experiences,
    //   education,
    //   skills,
    //   achievements
    // ]);

    // Packer.toBlob(doc).then(blob => {
    //   console.log(blob);
    //   saveAs(blob, "example.docx");
    //   console.log("Document created successfully");
    // });
  }

  getFetchIntentToPublish() {
    this.ngxService.start();
    this.ispublishservice
      .fetchIntentToPublish(this.botType, this.serviceID)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data: any) => {
          if (data['status']) {
            this.readyToPublishList = data['data'];
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
  toRestore() {
    this.ngxService.start();
    const payload = {
      user: this.userName,
    };
    this.ispublishservice
      .restore(payload, this.botType, this.serviceID)
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
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
  publishIntents() {
    this.ngxService.start();
    let selectedIntents: any = [];
    console.log(this.readyToPublishList)
    this.readyToPublishList.forEach((intent: any) => {
      if (intent.checked) {
        selectedIntents.push(intent);
      }
      console.log(selectedIntents)
    });
    this.selectedIntent = selectedIntents;
    const payload: any = {
      publishArray: [],
      user: this.userName,
    };
    this.selectedIntent.forEach((intent: any) => {
      payload['publishArray'].push(intent);
    });

    this.ispublishservice
      .publishIntents(this.botType, this.serviceID, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            console.log(data)
            this.toastr.success(data['message']);
            this.getAllDetails();
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
}
