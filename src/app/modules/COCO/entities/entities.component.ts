
import { AddEditEntitiesComponent } from './../add-edit-entities/add-edit-entities.component';
import { BackPopupComponent } from '../back-popup/back-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { ISEntitiesService } from './../../core/services/IS/ISEntities.service';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { forkJoin, of, Subject } from 'rxjs';
import { BotService } from '../../core/services/bot.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
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
export class EntitiesComponent implements OnInit, OnDestroy {
  @Input() editFlag: any;
  serviceId: any;
  botType: any;
  botName: any;
  title: any;
  timeoutId: any;
  // entity: any;
  searchQuery: any;
  deploymentInfo: any;
  entities: any;
  public tab: any = 'global';
  public unsubscribe = new Subject<any>();
  configureEntitiesFlag: boolean = false;
  viewEntitiesFlag: boolean = false;
  entityName:any;
backEvent:any
  globalEntities: any = [];
  customEntities: any = [];
  constructor(
    private isEntitiesService: ISEntitiesService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private botService: BotService,
private appService:AppService
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    let deploymentInfo = localStorage.getItem("botDetails");
    this.deploymentInfo = deploymentInfo ? JSON.parse(deploymentInfo) : {}
    this.serviceId = localStorage.getItem('ISId');
    this.botType = localStorage.getItem('botType');
    this.botName = localStorage.getItem('botName');
    this.getEntities();
    this.appService.getBackEvent().subscribe((res:any)=>{
      this.backEvent =res

    })
  }

  trainAgent = () => {
    this.ngxService.start()
    this.botService.trainAgent(this.serviceId).subscribe(
      data=> {
        this.ngxService.stop()
      }
    )
  }

  getEntities() {
    this.ngxService.start();
    forkJoin([
      this.isEntitiesService.listEntites(
        'global',
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe(catchError((err=>{return of (undefined)}))), // get global entities
      this.isEntitiesService.listEntites(
        'custom',
        this.searchQuery,
        this.botType,
        this.serviceId
      ).pipe(catchError((err=>{return of (undefined)}))), // get custom entities
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (result) => {
          if(result[0] && result[0].data){
            this.globalEntities = result[0]['data'];
          }
          if(result[1] && result[1].data){
            this.customEntities = result[1]['data'];
          }
          this.globalEntities = this.globalEntities.map((x: any) =>{
            if(!x.entityName){
              return
            }
            return ({
              ...x,
              entityType: 'global',
              agent: 'COCO',
            })
          });
          this.ngxService.stop();
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error.error.message);
          this.ngxService.stop();
        }
      );
  }

  searchEntities() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getEntities();
    }, 450);
    // forkJoin([
    //   this.isEntitiesService.listEntites(
    //     'global',
    //     this.searchQuery,
    //     this.botType,
    //     this.serviceId
    //   ), // get global entities
    //   this.isEntitiesService.listEntites(
    //     'custom',
    //     this.searchQuery,
    //     this.botType,
    //     this.serviceId
    //   ), // get custom entities
    // ])
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe(
    //     ([response1, response2]) => {
    //       this.globalEntities = response1['data'];
    //       this.customEntities = response2['data'];
    //       this.globalEntities.map((x: any) => ({
    //         ...x,
    //         entityType: 'global',
    //         agent: 'COCO',
    //       }));
    //       this.cdr.detectChanges();
    //     },
    //     (error) => {
    //       this.toastr.error(error.error.message);
    //     }
    //   );
  }

  addEntity() {
    const modalRef = this.modalService.open(AddEditEntitiesComponent, {
      windowClass: 'modal-xl,modal-content',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.result.then((result) => {
      if (result) {
        this.getEntities();
      }
    });
  }
  editEntities(event: any) {
    this.configureEntitiesFlag = event;
  }
  setEntityName(event:any){
    this.entityName=event;
  }
  viewEntities(event:any){
    this.viewEntitiesFlag = event;
  }
  addEditEntities(event: any) {
    this.configureEntitiesFlag = event;
  }
  entityEmit(){
    this.configureEntitiesFlag = false;
  }
  addViewEntities(event:any){
    this.viewEntitiesFlag = event;

  }
  // back() {
  //   this.configureEntitiesFlag=false;
  //   this.viewEntitiesFlag=false;
  // }
back(){
if(this.backEvent===true){
  const modalRef = this.modalService.open( BackPopupComponent, {
    windowClass: 'modal-xl,modal-content',
    animation: true,
    // backdrop: 'static',
    keyboard: false,
  });

}else{
  this.configureEntitiesFlag=false;
  this.viewEntitiesFlag=false;
}
}
}
