import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AddEditAgentComponent } from './add-edit-agent/add-edit-agent.component';
import { CreateSuccessPopupComponent } from './create-success-popup/create-success-popup.component';
import { MysolutionComponent } from './mysolution/mysolution.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxFileDragDropModule } from 'ngx-file-drag-drop';
import { AboutSolutionComponent } from './about-solution/about-solution.component';
import { MysolutionColiveComponent } from './mysolution-colive/mysolution-colive.component';
import { EditActivesolutionComponent } from './edit-activesolution/edit-activesolution.component';
import { AddMoreAgentsComponent } from './add-more-agents/add-more-agents.component';

@NgModule({
  declarations: [
    HomeComponent,
    AddEditAgentComponent,
    CreateSuccessPopupComponent,
    MysolutionComponent,
    AboutSolutionComponent,
    MysolutionColiveComponent,
    EditActivesolutionComponent,
    AddMoreAgentsComponent,
  ],
  imports: [
    // AddEditAgentComponent,
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    NgSelectModule,
    MatStepperModule,
    NgxFileDragDropModule,
    ReactiveFormsModule,
  ],
  exports: [
    AddEditAgentComponent,
    CreateSuccessPopupComponent,
    MysolutionColiveComponent,
  ],
  entryComponents: [
    AddEditAgentComponent,
    CreateSuccessPopupComponent,
    MysolutionColiveComponent,
  ],
  providers: [],
})
export class HomeModule {}
