import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(private router: Router,
    private appService:AppService) {}

  userImage: any;
  userName: any;
  email: any;
  role: any;

  ngOnInit(): void {
    this.userImage = localStorage.getItem('userImage');
    this.userName = localStorage.getItem('userName');
    this.email = localStorage.getItem('email');
    if (this.email.length > 23) {
      this.email = this.email.substring(0, 23) + '...';
    }
    this.role = localStorage.getItem('role');
  }

  logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  };

  setRoutes(){
    this.appService.setHomeRoute(false);
    this.appService.setLensEvent(false);
    this.appService.setLensHomeRoute(false);
  }
}
