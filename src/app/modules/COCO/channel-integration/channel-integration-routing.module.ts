import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelIntegrationComponent } from './channel-integration.component';

const routes: Routes = [{ path: '', component: ChannelIntegrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelIntegrationRoutingModule { }
