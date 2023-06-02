import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressExecutionRoutingModule } from './progress-execution-routing.module';
import { ProgressExecutionComponent } from './progress-execution.component';
import { ToBeExecutedComponent } from './to-be-executed/to-be-executed.component';
import { HistoryComponent } from './history/history.component';


@NgModule({
  declarations: [
    ProgressExecutionComponent,
    ToBeExecutedComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    ProgressExecutionRoutingModule
  ]
})
export class ProgressExecutionModule { }
