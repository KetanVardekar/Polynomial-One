import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ChangeDetectorRef,
  } from '@angular/core';
  import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
  import { ToastrService } from 'ngx-toastr';
  import { NgxUiLoaderService } from 'ngx-ui-loader';
  import { Subject } from 'rxjs';
  import { takeUntil } from 'rxjs/operators';
import { BotService } from 'src/app/modules/core/services/bot.service';
import * as CryptoJS from 'crypto-js';

  @Component({
    selector: 'app-configure-pop-up',
    templateUrl: './configure-pop-up.component.html',
    styleUrls: ['./configure-pop-up.component.scss'],
  })
  export class ConfigureLogs implements OnInit, OnDestroy {
    public unsubscribe = new Subject<any>();
    excelLinkInput: any;
    botType: any;
    displayName: any;
    edit: any = false;
    botDetails: any;
    hashKey: any = "Interaction-Studio-By-Polynomial.AI";

    constructor(
        private activeModal: NgbActiveModal,
        private ngxService: NgxUiLoaderService,
        private toastr: ToastrService,
        private cdr: ChangeDetectorRef,
        private botService: BotService,
      ) {}

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
      }

      ngOnInit(): void {
        let agentDetails:any = localStorage.getItem('botDetails')
        let agentLog:any = localStorage.getItem("agentLog");
        if(agentLog){
            this.excelLinkInput = agentLog
            this.edit = true;
        }
        agentDetails = JSON.parse(agentDetails)
        this.botDetails = agentDetails;
        this.botType = localStorage.getItem('botType');
        this.displayName = agentDetails.displayName
      }

      close() {
        this.activeModal.close();
      }

      activateLogs(){
        this.ngxService.start()
        let botType = CryptoJS.AES.decrypt(this.botType, this.hashKey)
        let dipheredBotType = botType.toString(CryptoJS.enc.Utf8);
        let projectId = CryptoJS.AES.decrypt(this.botDetails.projectId, this.hashKey)
        let dipheredProjectId = projectId.toString(CryptoJS.enc.Utf8)
        let payload = {
            botType: dipheredBotType,
            excelLink: this.excelLinkInput,
            displayName: this.displayName,
            projectId: dipheredProjectId
        }
        let serviceID = localStorage.getItem("ISId");
        if(this.edit){
            payload = {
                botType: dipheredBotType,
                excelLink: this.excelLinkInput,
                displayName: this.displayName,
                projectId: dipheredProjectId
            }
            this.botService.updateLogs(payload, serviceID).subscribe(
                data=> {
                    this.ngxService.stop();
                    this.close()
                    this.toastr.success(data['message']);
                },
                error => {
                    this.ngxService.stop();
                    this.toastr.error(error.error['message']);
                }
            )
        } else {
            this.botService.activateLogs(payload, serviceID).subscribe(
                data=> {
                    this.ngxService.stop();
                    this.close()
                    this.toastr.success(data['message']);
                },
                error => {
                    this.ngxService.stop();
                    this.toastr.error(error.error['message']);
                }
            )
        }
      }
  }