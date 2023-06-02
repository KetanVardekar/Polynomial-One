import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Inject, Renderer2, OnDestroy} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
import { Router, Event, NavigationEnd } from '@angular/router';
// import { BotTypeService } from '../service/bot-type/bot-type.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TutorialComponent } from '../../tutorial/tutorial.component';
import { BotTypeService } from '../../core/services/IS/isBotType.service';
import { BotService } from '../../core/services/bot.service';
// import { BotService } from '../service/bot/bot.service';
// import { ThemeService } from '../service/theme/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
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
                style({ opacity: 0, transform: 'translateY(15px)' }),
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
export class SidebarComponent implements OnInit, OnDestroy {


  public unsubscribe: Subject<void> = new Subject<void>();
  showLensAgents: boolean = false;
  showISAgents: boolean = false;
  path: string = 'assets/img/';
  serviceId: any;
  routes: Array<any> = [];
  show: boolean = false;
  activated: boolean = false;
  sidebarActive: boolean = false;
  agent: any;
  iframeURL: any;
  orgIcon: any = '';
  orgName: any
  avatarUri: string =
    'https://coliveshona.blob.core.windows.net/coliveshonabot/Shona.png';
  themeClass: string = 'theme-dark';
  randomColor:any;
  isIS:boolean=false


  constructor(
    private router: Router,
    private appService: AppService,
    private modalService: NgbModal,
    private botTypeService: BotTypeService,
    private sanitizer: DomSanitizer,
    private botService: BotService,
    // private themeService: ThemeService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url != '/agents') {
          // this.populateRoutes();
          // this.activated = true;
        } else {
          this.routes = [];
          //  this.activated = false;
          this.show = false;
        }
      }
    });
    //get Lens Agents
    this.appService
      .getLensEvent()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data == 'true') {
          this.showLensAgents = data;
          this.populateLensRoutes();
        } else {
          this.routes = [];
          // this.appService.setHomeRoute('false');
        }
      });
    //get IS Agents
    this.appService
      .getISEvent()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data == 'true') {
          this.showISAgents = data;
          this.appService.setHomeRoute(true);
          this.populateISRoutes();
          this.isIS=true;
        } else {
          this.routes = [];
          this.isIS=false;
        }
      });
      this.appService.getOrgPictureEvent().subscribe((response) => {
        response ? this.orgIcon = response : this.orgIcon = "";

      });
  }



  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  closeClick() {
   this.sidebarActive=false
}
  toggleBot = () => {
    this.show = !this.show;
  };

  transform(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  };

  fetchBot = () => {
    this.botService.fetchBot(this.serviceId).subscribe((data: any) => {
      console.log(data.data[0]);
      this.avatarUri = data.data[0].avatarUri;
      this.botService.updateAvatarURI(this.avatarUri);
    }, (error: any) => {
      console.log(error);
    });
  }

  fetchAvatarURI = () => {
    //Call fetchBot explicitly to fetch avatar icon
    //The icon needs to be loaded separately as it is part of Interaction studio
    //other bot information is loaded in iframe
    this.fetchBot();
  }

  ngOnInit() {
    // Show organization icon on sidebar or show default placeholder
    this.randomColor = Math.floor(Math.random()*16777215).toString(16);
    this.orgIcon = localStorage.getItem('orgIcon');
    this.serviceId = localStorage.getItem("ISId")
    this.orgName = localStorage.getItem("organization")
    // if (!this.orgIcon) {
    //   this.orgIcon = 'assets/img/Polynomial One logo2.svg';
    // }
    let lens = localStorage.getItem('isLens');
    let IS = localStorage.getItem('isIS');
    if (lens == 'true') {
      this.isIS=false;
      this.populateLensRoutes();

    }
    if (IS == 'true') {
      this.isIS=true;
      this.populateISRoutes();
    }

    this.botTypeService.getType.subscribe(
      (data: any) => {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
          //data is empty
          let botDetails = localStorage.getItem('botDetails');
          data = botDetails ? JSON.parse(botDetails).botDeploymentInfo : {};
        }
        this.agent = localStorage.getItem("botType");
        if (this.agent !== null && data.frontEndUrl) {
          localStorage.setItem('botTypeUrl', data.frontEndUrl);
          this.iframeURL = this.transform(`${data.frontEndUrl}&&colorHex=1732A4`);//url with bot type provided by API
          this.fetchAvatarURI();
          if (localStorage.getItem('isIS') == 'true') {
            this.populateISRoutes();
          }
          this.activated = true;
        } else {
          this.activated = false;
        }
      },
      error => {
        console.log(error);
      }
    );

    // this.themeService.currentTheme.subscribe(
    //   data => {
    //     if (data == "switch") {
    //       this.switchTheme();
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );

    this.themeClass = 'theme-dark';
    this.switchTheme();
  }

  redirectToHome(value: any) {
    this.showISAgents = false;
    this.showLensAgents = false;
    this.routes = [];
    localStorage.setItem('isLens', 'false');
    localStorage.setItem('isIS', 'false');
    localStorage.removeItem("agentLog");
    localStorage.removeItem('botIcon');
    localStorage.removeItem('botName');
    localStorage.removeItem('agentDetails');


    this.appService.setHomeRoute(false);
    this.appService.setLensEvent(false);
    this.appService.setLensHomeRoute(false);
    switch (value) {
      case 'home':
        this.router.navigate(['/home']);
        break;

      case 'subscription':
        this.router.navigate(['/subscription']);
        break;

      case 'analytics':
        this.router.navigate(['/analytics']);
        break;
      case 'tutorial':
        const modalRef = this.modalService.open(TutorialComponent, {
          size: 'xl',
        });
        break;
    }
  }

  switchTheme = () => {
    if (this.themeClass == 'theme-light') {
      this.renderer.addClass(this.document.body, 'theme-dark');
      this.renderer.removeClass(this.document.body, 'theme-light');
      this.themeClass = 'theme-dark';
      localStorage.setItem('theme', 'theme-dark');
    } else if ((this.themeClass = 'theme-dark')) {
      this.renderer.addClass(this.document.body, 'theme-light');
      this.renderer.removeClass(this.document.body, 'theme-dark');
      this.themeClass = 'theme-light';
      localStorage.setItem('theme', 'theme-light');
    }
  };

  populateISRoutes = () => {
    this.routes = [
      {
        link: 'entities',
        icon: `${this.path}/coco/Entities.svg`,
        text: 'Entities',
      },
      {
        link: 'intents',
        icon: `${this.path}/coco/Intent.svg`,
        text: 'Intents',
      },
      {
        link: 'response-library',
        icon: `${this.path}/coco/Response library.svg`,
        text: 'Response Library',
      },
      {
        link: 'integrations',
        icon: `${this.path}/coco/integrations.svg`,
        text: 'Integrations',
      },
      {
        link: 'coordinator',
        icon: `${this.path}/coco/Coordinator.svg`,
        text: 'Coordinator',
      },
      // {
      //   link: "analytics",
      //   icon: `${this.path}Dashboard.svg`,
      //   text: "Analytics"
      // },
      {
        link: 'channel-integration',
        icon: `${this.path}/coco/channel Integration.png`,
        text: 'Channel Integration',
      },
      {
        link: 'publish',
        icon: `${this.path}/coco/Publish.svg`,
        text: 'Publish',
      },
      {
        link: 'agent-settings',
        icon: `${this.path}/lens/Settings.svg`,
        text: 'Settings',
      },
    ];
  };

  populateLensRoutes = () => {
    this.routes = [
      {
        link: 'brains',
        icon: `${this.path}/lens/Brains.svg`,
        text: 'Brains',
      },
      {
        link: 'insights',
        icon: `${this.path}/lens/Insights.png`,
        text: 'Insights',
      },
      {
        link: 'data-relationship',
        icon: `${this.path}/lens/Data Relationship.svg`,
        text: 'Data Relationship',
      },
      {
        link: 'accessKey',
        icon: `${this.path}/lens/Access Keys.svg`,
        text: 'Access Key',
      },
      {
        link: 'lens-settings',
        icon: `${this.path}/lens/Settings.svg`,
        text: 'Settings',
      },
      // {
      //   link: 'progress-execution',
      //   icon: `${this.path}/lens/Settings.svg`,
      //   text: 'Progress Execution',
      // },
      // {
      //   link: "analytics",
      //   icon: `${this.path}Dashboard.svg`,
      //   text: "Analytics"
      // },
      // {
      //   link: "publish",
      //   icon: `${this.path}Publish.svg`,
      //   text: "Publish"
      // }
    ];
  };
}
