import { AppService } from './../../../../app.service';
import { takeUntil } from 'rxjs/operators';
import { ISEntitiesService } from './../../../core/services/IS/ISEntities.service';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-entities',
  templateUrl: './view-entities.component.html',
  styleUrls: ['./view-entities.component.scss']
})
export class ViewEntitiesComponent implements OnInit {
  @Input() customEntitiesData: any;
  @Input() selectedEntityName:any;
  botType: any;
  serviceId: any;
  entityType: any;
  searchQuery: any;
  entitiesName :any ;
  entity:any;
  entitiesArray :any = []
  public unsubscribe = new Subject<any>();
  showScroll: boolean = false;


  constructor(
    private isEntitiesService: ISEntitiesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private appService:AppService
  ) {}

  ngOnInit(): void {
    this.botType = localStorage.getItem('botType');
    this.serviceId = localStorage.getItem('ISId');
    this.fetchEntityData();
  }
  fetchEntityData(){
    const payload: any = {
      entityName : this.selectedEntityName
    };
    this.ngxService.start();
    this.isEntitiesService
      .fetchEntityData(this.botType, 'custom', '', this.serviceId, payload)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (res) => {
          if (res['status']) {
            res.data.filter((x:any)=>{
              this.entitiesArray = x. entities
            })
            // this.toastr.success(res['message']);
            this.ngxService.stop();
          } else {
            this.toastr.error(res['message']);
            this.ngxService.stop();
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
          this.ngxService.stop();
        }
      );

  }
}
