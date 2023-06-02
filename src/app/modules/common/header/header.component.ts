import { AppService } from 'src/app/app.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes,
} from '@angular/animations';
// import { BotTypeService } from '../service/bot-type/bot-type.service';
// import { BotService } from '../service/bot/bot.service';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, Subject } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import 'rxjs/add/observable/interval';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
// import { ThemeService } from '../service/theme/theme.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(500, style({ opacity: 0 }))]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  public unSubscribe: Subject<any> = new Subject();
  profilePicture: any;
  Picture: any;
  lensProfilePicture: any
  isLens:any
  constructor(

    // private botTypeService: BotTypeService,
    // private botService: BotService,
    // private router: Router,
    // private themeService: ThemeService
    private cdr: ChangeDetectorRef,
    private appService: AppService,
    private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private toastr: ToastrService,

  ) {
    // Observable.interval(120000).subscribe((x: any) => {
    //   this.getFetchNotification();
    // });
    this.appService
      .getHomeRoute()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data == true) {
          this.botName = localStorage.getItem('botName');
          this.avatarURI = localStorage.getItem('botIcon')
            ? localStorage.getItem('botIcon')
            : 'assets/img/coco.svg';
        } else {
          this.botName = '';
          this.avatarURI = '';
        }
      });
    this.appService
      .getLensHomeRoute()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data) => {
        if (data == true) {
          this.getLensIcon();
        } else {
          this.botName = '';
          this.avatarURI = '';
        }

      });
    this.appService.getProfilePictureEvent().subscribe((response) => {
      response ? this.profilePicture = response : this.profilePicture = "";
      this.cdr.detectChanges();
    });
    this.appService.getLensProfilePictureEvent().subscribe((response) => {
      response ?
        this.lensProfilePicture = response : this.lensProfilePicture = "";
    })

    this.appService.getLensPictureEvent().subscribe((response) => {
      response ?
        this.lensProfilePicture = response : this.lensProfilePicture = "";
    })

    this.appService.getDesktopNotificationEvent().subscribe((response) => {
      response ?
        this.desktopNotificationAllowed = response : this.desktopNotificationAllowed = ""
    })
  }

  public unsubscribe: Subject<any> = new Subject();

  path: string = 'assets/img/';
  botName: any;
  updatedUserName: any;
  botType: any;
  isIs:any
  userName: any;
  avatarURI: any = '';
  lensPicture: any
  showAccountDropdown: boolean = false;
  showNotification: boolean = false;
  themeClass: string = 'theme-dark';
  showMenu: boolean = false;
  desktopNotification: any
  desktopNotificationAllowed: any
  routes: Array<any> = [
    {
      link: 'entities',
      icon: `${this.path}Entities.svg`,
      text: 'Entities',
    },
    {
      link: 'intents',
      icon: `${this.path}Intent.svg`,
      text: 'Intents',
    },
    {
      link: 'response-library',
      icon: `${this.path}Response library.svg`,
      text: 'Response Library',
    },
    {
      link: 'integrations',
      icon: `${this.path}integrations.svg`,
      text: 'Integrations',
    },
    {
      link: 'coordinator',
      icon: `${this.path}Coordinator.svg`,
      text: 'Coordinator',
    },
    {
      link: 'analytics',
      icon: `${this.path}Dashboard.svg`,
      text: 'Analytics',
    },
    {
      link: 'publish',
      icon: `${this.path}Publish.svg`,
      text: 'Publish',
    },
  ];

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.isLens = localStorage.getItem('isLens');
this.isIs = localStorage.getItem('isIS');
    this.botType = localStorage.getItem('botType');
    this.profilePicture = localStorage.getItem('profileImage');
    this.updatedUserName = localStorage.getItem('updatedUserName');
    this.lensProfilePicture = localStorage.getItem('lensProfileImage')
    this.lensPicture = localStorage.getItem('lensImage')
    if (localStorage.getItem('botIcon')) {
      this.botName = localStorage.getItem('botName');
      this.avatarURI = localStorage.getItem('botIcon')
        ? localStorage.getItem('botIcon')
        : 'assets/img/coco.svg';
    }
    if (localStorage.getItem('agentDetails')) {
      this.getLensIcon();
    }
    this.settingsDetails();

    //this.themeClass = localStorage.getItem("theme");

    //Update bot name whenever bot is switched
    // this.botTypeService.getType.subscribe(
    //   data => {
    //     this.botName = localStorage.getItem("botName");
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );

    //Update bot Avatar whenever bot is switched
    // this.botService.getBotAvatarURI.subscribe(
    //   data => {
    //     if (data && Object.keys(data).length === 0 && data.constructor === Object) {//if blank
    //       this.avatarURI = "";
    //     } else {
    //       this.avatarURI = data;
    //     }
    //     console.log(data);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  // getFetchNotification() {
  //   this.notificationService
  //     .fetchNotification()
  //     .pipe(takeUntil(this.unsubscribe))
  //     .subscribe(
  //       (data: any) => {
  //         if (data['status']) {
  //           console.log("header",data['data']);
  //         }
  //       },
  //       (error: any) => {
  //         console.log(error.error.message)
  //       }
  //     );
  // }

  switchTheme = () => {
    // this.themeService.update("switch");
    this.showMenu = false;
    if (this.themeClass == 'theme-dark') {
      this.themeClass = 'theme-light';
    } else if ((this.themeClass = 'theme-light')) {
      this.themeClass = 'theme-dark';
    }
  };

  logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // this.router.navigate(['/']);
  };

  showHideAccount = (flag: boolean) => {
    this.showAccountDropdown = flag;
  };
  closeAccount() {
    this.showAccountDropdown = false;
  }

  showHideNotification = (flag: boolean) => {
    this.showNotification = flag;
  };
  closeNotification() {
    this.showNotification = false;
  }
  settingsDetails() {
    this.ngxService.start();
    this.userService
      .getSettingsDetails()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (data: any) => {
          if (data['status']) {
            this.desktopNotificationAllowed =
              data['data']['isDesktopNotificationAllowed'];
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
  getLensIcon() {
    let details: any = localStorage.getItem('agentDetails');
    let agentDetails: any = JSON.parse(details);
    this.userName = agentDetails.name ? agentDetails.name : '';
    this.avatarURI = agentDetails.imageURL
      ? agentDetails.imageURL
      : 'assets/img/lens.svg';
  }
}
