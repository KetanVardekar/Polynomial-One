import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISEntitiesService } from '../../core/services/IS/ISEntities.service';
import { ISIntentsService } from '../../core/services/IS/ISintents.service';
import { OrganizationService } from '../../core/services/organization.service';

@Component({
  selector: 'app-upload-file-pop-up',
  templateUrl: './upload-file-pop-up.component.html',
  styleUrls: ['./upload-file-pop-up.component.scss']
})
export class UploadFilePopUpComponent implements OnInit, OnDestroy {
  jsonFile: any;
  botType: any;
  serviceID:any;
  dlAnchorElem:any
  // entityName: any;
  @Input() entityName:any;
  @Input() setIntentsName: any;
  public unsubscribe = new Subject<any>();

  constructor(
    private activeModal: NgbActiveModal,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private isEntitesService: ISEntitiesService,
    private organizationService: OrganizationService,
    private isIntentsService: ISIntentsService,
  ) { }

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceID = localStorage.getItem('ISId');

  }
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  uploadImage(event: any) {
    this.ngxService.start();
    console.log(event);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.jsonFile = reader.result;
      console.log(this.jsonFile);
console.log(this.setIntentsName)

    };
    this.organizationService
      .fileUpload(formData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          if (data['status']) {
            this.toastr.success(data['message']);
            this.jsonFile = data['data']['url'];
            console.log(this.jsonFile);
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
  uploadJSON() {
    if (this.jsonFile) {
      const payload: any = {
        file: this.jsonFile,
      };
      this.ngxService.start();
      this.isEntitesService
        .updateEntityByJsonFile(
          this.botType,
          'custom',
          this.setIntentsName,
          this.serviceID,
          payload
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (data: any) => {
            this.toastr.success(data['message']);
            this.ngxService.stop();
          },
          (error) => {
            this.ngxService.stop();
          }
        );
    } else {
      this.toastr.error('Please upload a json file');
      return;
    }
  }
  close() {
    this.activeModal.close();
  }
  downloadJson(){
   const json_obj = {
      "entityValues": [
        {
          "displayName": "test",
          "synonyms": [
            "test",
            "testy",
            "tester",
          ]
        },
        {
          "displayName": "test1",
          "synonyms": [
            "test1",
            "testy1",
            "tester1"
          ]
        }
      ]
    }
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json_obj));
    this.dlAnchorElem = document.getElementById('downloadAnchorElem');
    this.dlAnchorElem.setAttribute("href", dataStr);
    this.dlAnchorElem.setAttribute("download", "sample_entity_upload_format.json");
    this.dlAnchorElem.click();
  }
}
