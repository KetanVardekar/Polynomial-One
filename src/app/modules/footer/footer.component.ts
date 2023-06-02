import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  year:any;
  ngOnInit() {
    let d = new Date();
    this.year = d.getFullYear();
  }

}
