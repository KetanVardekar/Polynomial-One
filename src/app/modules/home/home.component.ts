import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from './../core/services/home.service';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { AddEditAgentComponent } from './add-edit-agent/add-edit-agent.component';
import { BotService } from '../core/services/bot.service';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { Url } from 'url';
import { url } from 'inspector';
import { MysolutionComponent } from './mysolution/mysolution.component';
import { AboutSolutionComponent } from './about-solution/about-solution.component';
import { MysolutionColiveComponent } from './mysolution-colive/mysolution-colive.component';
import { EditActivesolutionComponent } from './edit-activesolution/edit-activesolution.component';
import { MysolutionService } from '../core/services/mysolution.service';
import { BotTypeService } from '../core/services/IS/isBotType.service';
import { AddMoreAgentsComponent } from './add-more-agents/add-more-agents.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit, OnDestroy {
  public unsubscribe: Subject<any> = new Subject();
  userName: any;
  updatedUserName:any
  public tab: any = 'myAgent';
  agentList: Array<any> = [];
  mySolutionDataList: Array<any> = [];
  selectedAgent: any;
  serviceList: Array<any> = [];
  lensAgentList: Array<any> = [];
  response: Array<any> = [];
  interactionAgentList: Array<any> = [];
  lensId: any;
  interactionId: any;
  cocoAgent: any
  kitsList: Array<any> = [];
  recordAgent: Array<any> = [];
  viewAllAgentFlag = false;
  viewAllCocoAgentFlag = false

  activesolutionList = [
    {
      image: 'assets/img/coco.svg',
      hadding: 'SONA ASSISTS',
      introduction: 'Meeting Agent',
      images: 'assets/img/coco/Shona.png',
      dates: '28 jan 2022',
    },
    {
      image: 'assets/img/coco.svg',
      hadding: 'SONA ASSISTS',
      introduction: 'Meeting Agent',
      images: 'assets/img/coco/Shona.png',
      dates: '28 jan 2022',
    },
  ];
  constructor(
    private homeService: HomeService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private appService: AppService,
    private botService: BotService,
    private botTypeService: BotTypeService,
    private router: Router,
    private mysolutionService: MysolutionService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.updatedUserName = localStorage.getItem('updatedUserName');
    this.appService.setLensEvent('false');
    this.appService.setISEvent('false');
    await this.getServiceList();
    this.getMySolutionData();
  }
  async getServiceList() {
    this.ngxService.start();
    this.homeService
      .getServiceList()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          this.serviceList = data['data'];
          this.lensId = this.serviceList.filter((x) => x.name == 'Lens');
          this.interactionId = this.serviceList.filter(
            (x) => x.name == 'Interaction Studio'
          );
          localStorage.setItem('lensId', this.lensId[0]._id);
          localStorage.setItem('ISId', this.interactionId[0]._id);
          this.getAgentList();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }

  getAgentList() {
    this.lensAgentList = [];
    this.interactionAgentList = [];
    this.agentList = [];
    this.recordAgent = [];
    this.viewAllAgentFlag = false;
    this.viewAllCocoAgentFlag = false

    forkJoin([
      this.homeService.listAgents(this.lensId[0]._id).pipe(
        catchError((err) => {
          return of(undefined);
        })
      ), //observable 1
      this.botService.botList(this.interactionId[0]._id).pipe(
        catchError((err) => {
          return of(undefined);
        })
      ), //observable 2
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (result) => {
          if (
            result[0] &&
            result[0].data &&
            result[0].data.agents &&
            result[0].data.agents.length
          ) {
            this.lensAgentList = result[0]['data']['agents'];
            this.lensAgentList = this.lensAgentList.map((x) => ({
              ...x,
              color: this.getRandomColor(),
            }));
            this.agentList.push(...this.interactionAgentList);

            this.lensAgentList = [
              ...this.lensAgentList.map((x) => ({
                ...x,
                updateName: x.name,
              })),
            ];
            this.lensAgentList.forEach((element: any) => {
              if (element.updateName.length > 17) {
                element.updateName =
                  element.updateName.substring(0, 17) + '...';
              }
            });
            this.lensAgentList.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
            this.recordAgent.push(...this.lensAgentList);

            if (this.recordAgent && this.recordAgent.length > 6) {
              this.recordAgent.length = 5;
            } else {
              this.viewAllAgentFlag = true;
            }

          }
          if (result[1] && result[1].data && result[1].data.length) {
            this.interactionAgentList = result[1]['data'];
            this.interactionAgentList = this.interactionAgentList.map((x) => ({
              ...x,

              color: this.getRandomColor(),
            }));
            this.cocoAgent = [...this.interactionAgentList]
            this.agentList.push(...this.interactionAgentList);

            if (this.interactionAgentList && this.interactionAgentList.length > 6) {
              this.interactionAgentList.length = 5;
            } else {
              this.viewAllCocoAgentFlag = true;
            }
            this.interactionAgentList.forEach((element: any) => {
              if (element.description.length > 47) {
                element.description =
                  element.description.substring(0, 47) + '...';
              }
            });
          }
          if (this.agentList.length > 3) {
            this.agentList.length = 3;
          }
          this.agentList.forEach((element: any) => {
            if (element.description.length > 47) {
              element.description =
                element.description.substring(0, 47) + '...';
            }
          });
          this.cdr.detectChanges();
          if (this.interactionAgentList && !this.interactionAgentList.length && this.recordAgent && !this.recordAgent.length) {
            this.tab = 'createAgent';
            this.getKitsList();
          }
          this.ngxService.stop();
        },

        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }

  getKitsList() {
    this.ngxService.start();
    this.homeService
      .getKits(this.lensId[0]._id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          this.kitsList = data['data']['kits'];
          this.kitsList = this.kitsList.map((v: any) => ({
            ...v,
            bottomHeading: '',
            image:
              v.key == 'meetingKit'
                ? 'assets/img/Meeting Kit.png'
                : v.key == 'normalTextKit'
                  ? 'assets/img/Normal Text.png'
                  : '',
          }));

          this.kitsList.forEach((element) => {
            switch (element.key) {
              case 'meetingKit':
                element.bottomHeading = 'For Your  Insights';
                break;

              case 'normalTextKit':
                element.bottomHeading = ' For Your Specific  Insights';
                break;
            }
          });

          this.cdr.detectChanges();
          this.ngxService.stop();
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }
  getMySolutionData() {
    this.ngxService.start();
    this.mysolutionService
      .getMySolution()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (res: any) => {
          if (res['status'] && res.data && res.data.length) {
            this.mySolutionDataList = res.data;
          } else {
            this.toastr.error(res['message']);
            this.ngxService.stop();
          }
        },
        (error) => {
          this.ngxService.stop();
          this.toastr.error(error.error.message);
        }
      );
  }

  addAgent() {
    if (this.interactionAgentList && this.interactionAgentList.length >= 3) {
      const modalRef = this.modalService.open(AddMoreAgentsComponent, {
        size: 'lg',
        animation: true,
        backdrop: 'static',
        keyboard: false,

      });
      return
    }else {
      const modalRef = this.modalService.open(AddEditAgentComponent, {
        size: 'lg',
        animation: true,
        backdrop: 'static',
        keyboard: false,
      });
      modalRef.componentInstance.addAgent = true;
      modalRef.componentInstance.editAgent = false;
      modalRef.componentInstance.serviceId = this.lensId[0]._id;
      modalRef.result.then((result) => {
        if (result) {
          this.getAgentList();
        }
      });
    }
  }

  editAgent(event: any, agent: any) {
    const modalRef = this.modalService.open(AddEditAgentComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.editAgent = true;
    modalRef.componentInstance.serviceId = agent.serviceID;
    modalRef.componentInstance.agentId = agent._id;
    modalRef.result.then((result) => {
      if (result) {
        this.getAgentList();
      }
    });
  }
  switchAgent(agent: any, value?: any) {
    agent.imageURL
      ? this.appService.setLensPictureEvent(
        agent.imageURL
      )
      : this.appService.setLensPictureEvent('');
    localStorage.setItem('agentID', agent._id);
    switch (value) {
      case 'Lens':
        localStorage.setItem('isLens', 'true');
        this.appService.setLensEvent('true');
        localStorage.setItem('lensProfileImage', agent.imageURL)
        localStorage.setItem('agentDetails', JSON.stringify(agent));
        this.appService.setLensHomeRoute(true);
        this.router.navigate(['/brains']);
        break;
      case 'IS':
        this.ngxService.start();
        const payload = {
          botType: agent.botType,
          serviceID: this.interactionId[0]._id,
        };
        this.botService
          .encryptBot(payload)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((data) => {
            localStorage.setItem('isIS', 'true');
            localStorage.setItem('botType', data['data']['encrypt']);
            localStorage.setItem('botName', agent.displayName);
            localStorage.setItem('botIcon', agent.avatarUri);
            localStorage.setItem('botDetails', JSON.stringify(agent));
            this.botTypeService.update(agent.botDeploymentInfo);
            this.appService.setISEvent('true');
            this.appService.setHomeRoute(true);
            this.router.navigate(['/entities']);
            this.ngxService.stop();
          });
        break;
    }

  }
  editBot(agent: any) {
    const modalRef = this.modalService.open(AddEditAgentComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.addAgent = true;
    modalRef.componentInstance.editAgent = false;
    modalRef.componentInstance.selectedBot = agent
    modalRef.componentInstance.serviceId = this.interactionId[0]._id;
    modalRef.result.then((result) => {
      if (result) {
        this.getAgentList();
      }
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // this.cdr.detectChanges();
    return color;
  }
  getMeetlist(agent: any) {
  if (this.recordAgent && this.recordAgent.length >= 3) {
      const modalRef = this.modalService.open(AddMoreAgentsComponent, {
        size: 'lg',
        // animation: true,
        // backdrop: 'static',
        // keyboard: false,
      });
      return
    }else{
    const modalRef = this.modalService.open(AddEditAgentComponent, {
      size: 'lg',
      animation: true,
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.key = agent._id;
    modalRef.componentInstance.serviceId = agent.serviceID;
    modalRef.componentInstance.agentName = agent.name;
  }
  }
  viewAgent() {
    this.recordAgent = [];
    this.recordAgent = [...this.lensAgentList];
    this.viewAllAgentFlag = true;
  }
  viewCocoAgent() {
    this.interactionAgentList = []
    this.interactionAgentList = this.cocoAgent
    this.viewAllCocoAgentFlag = true
  }
  about() {
    const modalRef = this.modalService.open(AboutSolutionComponent, {
      size: 'xl',
    });
  }
  Active() {
    const modalRef = this.modalService.open(MysolutionComponent, {
      size: 'xl',
    });
  }
  solutionColive() {
    const modalRef = this.modalService.open(MysolutionColiveComponent, {
      size: 'xl',
    });
  }
  editmySolution(event: any, agent: any) {
    const modalRef = this.modalService.open(EditActivesolutionComponent, {
      size: 'xl',
    });
  }
}
function a(a: any, arg1: (any: any) => void): any[] {
  throw new Error('Function not implemented.');
}

