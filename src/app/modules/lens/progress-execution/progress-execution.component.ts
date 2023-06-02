import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-execution',
  templateUrl: './progress-execution.component.html',
  styleUrls: ['./progress-execution.component.scss'],
})
export class ProgressExecutionComponent implements OnInit {
  public tab: any = 'executed';
  constructor() {}

  ngOnInit(): void {}
}
