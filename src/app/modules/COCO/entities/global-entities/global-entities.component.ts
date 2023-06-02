import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-global-entities',
  templateUrl: './global-entities.component.html',
  styleUrls: ['./global-entities.component.scss'],
})
export class GlobalEntitiesComponent implements OnInit {
  @Input() globalEntitiesData: any;
  botName: any;
  public tab: any = 'global';
  constructor() {}
  ngOnInit(): void {
    this.botName = localStorage.getItem('botName');
  }
}
