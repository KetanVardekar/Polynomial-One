import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ISchannelIntegrationService } from 'src/app/modules/core/services/IS/ischannel-integration.service';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-configure-pop-up',
  templateUrl: './configure-pop-up.component.html',
  styleUrls: ['./configure-pop-up.component.scss']
})
export class ConfigurePopUpComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();
  @Input() showWhatsapp: any
  @Input() showSlack: any
  @Input() whatsapp: any
  @Input() slack: any

  botType : any
  accessToken: any
  verificationToken: any
  accessTokenData: any
  verificationTokenData: any
  encryptInfoWhatsapp: any
  hashKey: any = "57c32e09c137b53cd56a168aec776dd5a0a0110148d37e0ef6464aabe7aecd1b8f9263fe" //Secret Hash Key
  encryptInfoSlack :any
  encryptedData :any
  count: any = 0;
  constructor(private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private ischannnelIntegrationService: ISchannelIntegrationService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
  }

  //For going on next page
  nextPage() {
    this.count++;

  }

  //For going on the back page
  back() {
    this.count--;
  }

  //Get access Token and count for going on next page
  getaccessToken(data: any) {
    this.count++;
    this.accessTokenData = data;
  }

  // For closing the modal
  close() {
    this.activeModal.close();
  }

  camelize(str: any) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match: any, index: any) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  //Getting WebhookURL for whatsapp
  getWebHookUrlWhatsapp(verificationToken: any) {
    this.verificationTokenData = verificationToken
    const whatsappChanneldata = {
      accessToken: this.accessTokenData,
      verifyToken: this.verificationTokenData,
      isActive: false
    }
    //Encrypted Info of Whatsapp
    this.encryptInfoWhatsapp = CryptoJS.AES.encrypt(JSON.stringify(whatsappChanneldata), this.hashKey).toString();
    this.ngxService.start();
    const payload = {
      botType : this.botType,
      channelType : this.camelize(this.whatsapp),
      channelData : this.encryptInfoWhatsapp
  }
    this.ischannnelIntegrationService.createChannel(payload).subscribe((res: any) => {
      if (res['status']) {
        this.toaster.success(res['message']);
        let bytes = CryptoJS.AES.decrypt(res.data.channelData, this.hashKey)
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        console.log(plaintext, "plain")
        this.encryptInfoWhatsapp = JSON.parse(plaintext).webhookUrl
        this.count++;
        this.ngxService.stop();
      } else {
        this.toaster.error(res['message']);
        this.ngxService.stop();
      }
    },
      (err) => {
        this.toaster.error(err.error.message);
        this.ngxService.stop();
      })


  }
  getWebHookUrlSlack() {
    const slackChannelData = {
      channelId: "",
      webhookUrl: '',
      isActive: false

    }
     //Encrypted Info of Slack
    this.encryptInfoSlack = CryptoJS.AES.encrypt(JSON.stringify(slackChannelData), this.hashKey).toString();
    this.ngxService.start();
    const payload = {
      botType: this.botType ,
      channelType: this.camelize(this.slack),
      channelData: this.encryptInfoSlack
    }
    this.ischannnelIntegrationService.createChannel(payload).subscribe((res: any) => {
      if (res['status']) {
        this.toaster.success(res['message']);
        let bytes = CryptoJS.AES.decrypt(res.data.channelData, this.hashKey)
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        console.log(plaintext, "plain")
        this.encryptInfoSlack = JSON.parse(plaintext).requestUrl
        this.count++;
        this.ngxService.stop();
      } else {
        this.toaster.error(res['message']);
        this.ngxService.stop();
      }
    },
      (err) => {
        this.toaster.error(err.error.message);
        this.ngxService.stop();
      })
  }
  //For Complete Onboarding
  completeWhatsappBoarding() {
    this.ngxService.start();
    const payload = {
      botType: this.botType ,
      channelType: this.camelize(this.whatsapp)
    }
    this.ischannnelIntegrationService.activateChannel(payload).pipe(takeUntil(this.unSubscribe)).subscribe((res) => {
      if (res['status']) {
        this.activeModal.close();
        this.toaster.success('Congrats!! Your channel is added successfuly, you can delete or edit it from channels window');
        this.ngxService.stop();
      } else {
        this.toaster.error(res['message']);
        this.ngxService.stop();
      }
    },
      (err) => {
        this.toaster.error(err.error.message);
        this.ngxService.stop();
      })
    this.ngxService.stop();
  }

  //Copied detail of WebHook URL
  copyWebHookURLDetail(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toaster.info('Webhook URL copied to clipboard');
  }

  //Copied detail of Verification Token
  copyVerificationTokenDetail(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toaster.info('Verification Token copied to clipboard');
  }
}
