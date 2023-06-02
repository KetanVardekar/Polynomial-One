import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgressExecutionComponent } from './progress-execution.component';

const routes: Routes = [{ path: '', component: ProgressExecutionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressExecutionRoutingModule { }
