import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { BotService } from './../../core/services/bot.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DeletePopUpComponent } from '../../common/delete-pop-up/delete-pop-up.component';
import { OrganizationService } from './../../core/services/organization.service';
import * as CryptoJS from 'crypto-js';
import { ConfigureLogs } from './configure-pop-up/configure-pop-up.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-settings',
  templateUrl: './agent-settings.component.html',
  styleUrls: ['./agent-settings.component.scss']
})
export class AgentSettingsComponent implements OnInit, OnDestroy {

  public unsubscribe: any = new Subject();
  Icon:any
  iframeURL: any;
  agentURL: any;
  botType: any;
  botIcon: any;
  hashKey: any = "Interaction-Studio-By-Polynomial.AI";
  excelLink: any = "Logs are not configured"
  agentDetails: any;
  logStatus: any = false;
  fontTypeList: any = ['Arial', 'Calibri', 'Comic Sans MS', 'Courier New', 'Georgia', 'Helvetica', 'Impact', 'Lucida Sans Unicode', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
  botDetails: any = {
    botName: '', //d
    botIcon: '',
    description: '',  //d
    liveAgentSupport: false, //d
    attachment: false, //d
    microphone: false, //d
    contactus: false, //d
    theme: false,
    sosButton: false,
    fonttype: '', //d
    fontsize: '', //d
    color: '#1732A4', //d
    width: '590', //d
    height: '530', //d
    autoInitialize: false, //d
    popupTime: '' //d,
  }
  constructor(
    private sanitizer: DomSanitizer,
    private botService: BotService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private modalService: NgbModal,
    private organizationService: OrganizationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.agentURL = localStorage.getItem('botTypeUrl')?.split('&')[0];
    this.Icon = localStorage.getItem('botIcon')
    let agentDetails:any = localStorage.getItem('botDetails')
    agentDetails = JSON.parse(agentDetails)
    this.agentDetails = agentDetails;
    this.botDetails.botName = agentDetails.displayName;
    this.botDetails.description = agentDetails.description
    this.botDetails.botIcon = agentDetails.avatarUri;
    this.botDetails.liveAgentSupport = agentDetails.liveAgentSupport ? agentDetails.liveAgentSupport : false;
    this.botDetails.attachment = agentDetails.botDeploymentInfo.attachment ? agentDetails.botDeploymentInfo.attachment : false;
    this.botDetails.microphone = agentDetails.botDeploymentInfo.microphone ? agentDetails.botDeploymentInfo.microphone : false;
    this.botDetails.contactus = agentDetails.botDeploymentInfo.contactUs ? agentDetails.botDeploymentInfo.contactUs : false;
    this.botDetails.autoInitialize = agentDetails.botDeploymentInfo.auto_init ? agentDetails.botDeploymentInfo.auto_init : false
    this.botDetails.fontsize = agentDetails.botDeploymentInfo.fontSize ? agentDetails.botDeploymentInfo.fontSize : this.botDetails.fontsize;
    this.botDetails.fonttype = agentDetails.botDeploymentInfo.fontType ? agentDetails.botDeploymentInfo.fontType : this.botDetails.fonttype?this.botDetails.fontType:this.fontTypeList[0]
    this.botDetails.height = agentDetails.botDeploymentInfo.height ? agentDetails.botDeploymentInfo.height : this.botDetails.height;
    this.botDetails.color = agentDetails.botDeploymentInfo.colorHex ? "#" + agentDetails.botDeploymentInfo.colorHex : this.botDetails.color
    this.botDetails.width = agentDetails.botDeploymentInfo.width ? agentDetails.botDeploymentInfo.width : this.botDetails.width;
    this.botDetails.popupTime = agentDetails.botDeploymentInfo.popup_time ? agentDetails.botDeploymentInfo.popup_time : this.botDetails.popupTime
    this.botDetails.sosButton = agentDetails.botDeploymentInfo.sosButton ? agentDetails.botDeploymentInfo.sosButton : this.botDetails.sosButton
    this.botIcon = agentDetails.avatarUri;
    this.botType = localStorage.getItem('botType');
    this.iframeURL = this.transform(`${this.agentURL}&&colorHex=1732A4`);
    this.makeIFrameURL();
    this.fetchLogDetails();
  }

  fetchLogDetails(){
    this.ngxService.start()
    let botType = CryptoJS.AES.decrypt(this.botType, this.hashKey)
    let dipheredBotType = botType.toString(CryptoJS.enc.Utf8);
    const agent= dipheredBotType
    let serviceID = localStorage.getItem("ISId");
    this.botService.getLogDetails(agent, serviceID).subscribe(
      data => {
        if(data.data.data){
          this.excelLink = data.data.data.excelLink;
          this.logStatus = true;
          localStorage.setItem("agentLog", data.data.data.excelLink)
          this.ngxService.stop();
        }
        this.ngxService.stop()
      },
      error=>{
        this.ngxService.stop();
        this.toastr.error(error['message']);
      }
    )
  }

  alphaOnly(event: any) {
    var key = event.keyCode;

    return (key >= 65 && key <= 90) || key == 8 || key == 32 || (key == 37 || key == 39 );
  }
  numberOnly(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  makeIFrameURL() {
    console.log("sjnss", this.botDetails.liveAgentSupport)
    this.iframeURL = this.transform(`${this.agentURL}${this.botDetails.color? `&colorHex=${this.botDetails.color.slice(1)}` : ''}${String(this.botDetails.fontsize).length >0 ? `&fontSize=${this.botDetails.fontsize}`:''}${this.botDetails.fonttype.length>0 ? `&fontType=${this.botDetails.fonttype}`:''}${`&attachment=${this.botDetails.attachment}`}${`&contactUs=${this.botDetails.contactus}`}${`&sosButton=${this.botDetails.sosButton}`}${`&liveAgentSupport=${this.botDetails.liveAgentSupport}`}`);
  }

  uploadImage(event: any) {
    this.ngxService.start();

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.botDetails.botIcon = reader.result;
      this.cdr.detectChanges();
    };
    this.organizationService
      .fileUpload(formData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
            this.botDetails.botIcon = data['data']['url'];

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
    this.botDetails.botIcon='';
    if(this.botDetails.botIcon == ''){
      this.botDetails.botIcon =this.Icon
    }
  }
  saveBotDetails() {
    if(this.botDetails.botName.length>=16){
      return
    }
    if(this.botDetails.botName)
    {
    this.ngxService.start()
    const payload = {
      "displayName": this.botDetails.botName,
      "botType": this.botType,
      "description": this.botDetails.description,
      "avatarUri": this.botDetails.botIcon,
      "liveAgentSupport": String(this.botDetails.liveAgentSupport),
      "attachment": String(this.botDetails.attachment),
      "microphone": String(this.botDetails.microphone),
      "contactUs": String(this.botDetails.contactus),
      // "switchTheme": this.botDetails.theme,
      "fontType": this.botDetails.fonttype,
      "fontSize": this.botDetails.fontsize,
      "colorHex": this.botDetails.color.slice(1),
      "width": this.botDetails.width,
      "height": this.botDetails.height,
      "auto_init": String(this.botDetails.autoInitialize),
      "popup_time": this.botDetails.popupTime,
      "sosButton": String(this.botDetails.sosButton)
      // "sharpEdge": false,
      // "source": "2",
      // "type": "crm",
    }
    let serviceID = localStorage.getItem("ISId");
    this.botService.updateBotinfo(payload, serviceID).pipe(takeUntil(this.unsubscribe)).subscribe((data: any) => {
      if (data['status']) {
        localStorage.setItem("botDetails", JSON.stringify(data['data'][0]))
        this.ngxService.stop();
        this.toastr.success(data['message']);
      } else {
        this.ngxService.stop();
        this.toastr.error(data['message']);
      }
    }, error => {
      this.ngxService.stop();
      this.toastr.error(error.error.message);
    })}
    else {
      this.toastr.error('Please fill all the fields');
      return;
    }
  }

  deleteBot() {
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'You want To delete this Bot';
    modalRef.componentInstance.selectedName = this.botDetails.botName
    modalRef.result.then((result) => {
      if (result) {
        this.ngxService.start();
        let botType = CryptoJS.AES.decrypt(this.botType, this.hashKey)
        let dipheredBotType = botType.toString(CryptoJS.enc.Utf8);
        console.log(dipheredBotType)
        const payload = {
          "botType": dipheredBotType,
        }
        let serviceID = localStorage.getItem("ISId");
        this.botService.deleteBot(payload, serviceID).pipe(takeUntil(this.unsubscribe)).subscribe((data: any) => {
          if (data['status']) {
            this.ngxService.stop();
            this.toastr.success(data['message']);
            this.router.navigate(['/home']);
          } else {
            this.ngxService.stop();
            this.toastr.error(data['message']);
          }
        }, error => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        })
      }
    });
  }

  configureLogs() {
    const modalRef = this.modalService.open(ConfigureLogs, {
      size: 'xl'
    });
    modalRef.result.then((result) => {
      if (result) {
        this.fetchLogDetails();
      }
    });
  }

  disableLogs(){
    const modalRef = this.modalService.open(DeletePopUpComponent, {
      size: 'l',
    });
    modalRef.componentInstance.title = 'You want To disable the logs for the Bot';
    modalRef.componentInstance.selectedName = this.botDetails.botName
    modalRef.result.then((result) => {
      if (result) {
        this.ngxService.start();
        let botType = CryptoJS.AES.decrypt(this.botType, this.hashKey)
        let dipheredBotType = botType.toString(CryptoJS.enc.Utf8);
        let projectId = CryptoJS.AES.decrypt(this.agentDetails.projectId, this.hashKey)
        let dipheredprojectId = projectId.toString(CryptoJS.enc.Utf8);
        console.log(dipheredBotType)
        const payload = {
          "botType": dipheredBotType,
          "projectId": dipheredprojectId
        }
        let serviceID = localStorage.getItem("ISId");
        this.botService.disableLogs(payload, serviceID).pipe(takeUntil(this.unsubscribe)).subscribe((data: any) => {
          if (data['status']) {
            this.ngxService.stop();
            localStorage.removeItem("agentLog")
            this.fetchLogDetails;
            this.toastr.success(data['message']);
          } else {
            this.ngxService.stop();
            this.toastr.error(data['message']);
          }
        }, error => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        })
      }
    });
  }

  copyExcelUrl(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toastr.info('Excel URL copied to clipboard');
  }
}
