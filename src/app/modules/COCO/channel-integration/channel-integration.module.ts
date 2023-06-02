import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelIntegrationRoutingModule } from './channel-integration-routing.module';
import { ChannelIntegrationComponent } from './channel-integration.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { ActiveChannelComponent } from './active-channel/active-channel.component';
import { SelectedChannelComponent } from './selected-channel/selected-channel.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewChannelComponent } from './view-channel/view-channel.component';
import { ConfigurePopUpComponent } from './configure-pop-up/configure-pop-up.component';


@NgModule({
  declarations: [
    ChannelIntegrationComponent,
    CreateChannelComponent,
    ActiveChannelComponent,
    SelectedChannelComponent,

    ViewChannelComponent,
      ConfigurePopUpComponent,
  ],
  imports: [
    CommonModule,
    ChannelIntegrationRoutingModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class ChannelIntegrationModule {}
