import { LensDataRelationShipService } from './modules/core/services/lens/LensDataRelationShip.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
// import { NgbAccordion, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './modules/core/layout/layout.component';
import { ToastrModule } from 'ngx-toastr';

import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './modules/core/services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './modules/footer/footer.component';
import { HeaderComponent } from './modules/common/header/header.component';
import { SidebarComponent } from './modules/common/sidebar/sidebar.component';
import { AccountComponent } from './modules/account/account.component';
import { UserManagementComponent } from './modules/user-management/user-management.component';
import { OrganizationManagementComponent } from './modules/organization-management/organization-management.component';
import { UserService } from './modules/core/services/user.service';
import { TokenInterceptor } from './modules/core/interceptor/interceptor';
import { OrganizationService } from './modules/core/services/organization.service';
import { AddEditMemberComponent } from './modules/add-edit-member/add-edit-member.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { HomeService } from './modules/core/services/home.service';
import { AddEditAgentComponent } from './modules/home/add-edit-agent/add-edit-agent.component';
import { BrainsComponent } from './modules/lens/brains/brains.component';
import { InsightsComponent } from './modules/lens/insights/insights.component';
import { DataRelationshipComponent } from './modules/lens/data-relationship/data-relationship.component';
import { AccessKeysComponent } from './modules/lens/access-keys/access-keys.component';
import { SettingsComponent } from './modules/lens/settings/settings.component';
import { AppService } from './app.service';
import { BotService } from './modules/core/services/bot.service';
import { EntitiesComponent } from './modules/COCO/entities/entities.component';
import { IntentsComponent } from './modules/COCO/intents/intents.component';
import { ResponseLibraryComponent } from './modules/COCO/response-library/response-library.component';
import { IntegrationsComponent } from './modules/COCO/integrations/integrations.component';
import { CoordinatorComponent } from './modules/COCO/coordinator/coordinator.component';
import { PublishComponent } from './modules/COCO/publish/publish.component';
import { ISEntitiesService } from './modules/core/services/IS/ISEntities.service';
import { ISCoordinatorService } from './modules/core/services/IS/IScoordinator.service';
import { ISIntegrationsService } from './modules/core/services/IS/ISintegrations.service';
import { ISIntentsService } from './modules/core/services/IS/ISintents.service';
import { ISPublishService } from './modules/core/services/IS/ISpublish.service';
import { ISResponseLibraryService } from './modules/core/services/IS/ISresponseLibrary.service';
import { AddEditEntitiesComponent } from './modules/COCO/add-edit-entities/add-edit-entities.component';
import { AddEditIntentsComponent } from './modules/COCO/add-edit-intents/add-edit-intents.component';
import { AddEditApiIntegrationsComponent } from './modules/COCO/add-edit-api-integrations/add-edit-api-integrations.component';
import { LensBrainsService } from './modules/core/services/lens/LensBrains.service';
import { AddEditCoordinatorComponent } from './modules/COCO/add-edit-coordinator/add-edit-coordinator.component';
import { AddEditResponseLibraryComponent } from './modules/COCO/add-edit-response-library/add-edit-response-library.component';
import { Ng5SliderModule } from 'ng5-slider';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { OddMessageCardComponent } from './modules/COCO/odd-messages/odd-message-card/odd-message-card.component';
import { OddMessageFormComponent } from './modules/COCO/odd-messages/odd-message-form/odd-message-form.component';
import { ListViewCardComponent } from './modules/COCO/list-view/list-view-card/list-view-card.component';
import { ListViewFormComponent } from './modules/COCO/list-view/list-view-form/list-view-form.component';
import { LoginCardComponent } from './modules/COCO/login/login-card/login-card.component';
import { LoginFormComponent } from './modules/COCO/login/login-form/login-form.component';
import { PropertyDetailsCardComponent } from './modules/COCO/property-details/property-details-card/property-details-card.component';
import { PropertyDetailsFormComponent } from './modules/COCO/property-details/property-details-form/property-details-form.component';
import { DeletePopUpComponent } from './modules/common/delete-pop-up/delete-pop-up.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { NotificationComponent } from './modules/notification/notification.component';
import { TutorialComponent } from './modules/tutorial/tutorial.component';
import { NgxFileDragDropModule } from 'ngx-file-drag-drop';
import { GraphComponent } from './modules/common/graph/graph.component';
import { DevEventModuleComponent } from './modules/lens/dev-event-module/dev-event-module.component';
import { GlobalEntitiesComponent } from './modules/COCO/entities/global-entities/global-entities.component';
import { CustomEntitiesComponent } from './modules/COCO/entities/custom-entities/custom-entities.component';
import { AvailableApiComponent } from './modules/COCO/integrations/available-api/available-api.component';
import { MappedCoordinatorComponent } from './modules/COCO/coordinator/mapped-coordinator/mapped-coordinator.component';
import { AvailableCoordinatorComponent } from './modules/COCO/coordinator/available-coordinator/available-coordinator.component';
import { ReadyToPublishComponent } from './modules/COCO/publish/ready-to-publish/ready-to-publish.component';
import { PublishHistoryComponent } from './modules/COCO/publish/publish-history/publish-history.component';
import { OrganizationDetailUpdateComponent } from './modules/organization-management/organization-detail-update/organization-detail-update.component';
import { UserManagementSubComponentComponent } from './modules/organization-management/user-management-sub-component/user-management-sub-component.component';
import { EditEntitiesComponent } from './modules/COCO/entities/edit-entities/edit-entities.component';
import { UploadFilePopUpComponent } from './modules/COCO/upload-file-pop-up/upload-file-pop-up.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewEntitiesComponent } from './modules/COCO/entities/view-entities/view-entities.component';
import { EditIntentsComponent } from './modules/COCO/intents/edit-intents/edit-intents.component';
import { ViewIntentsComponent } from './modules/COCO/intents/view-intents/view-intents.component';
import { AddSlotPopUpComponent } from './modules/COCO/intents/add-slot-pop-up/add-slot-pop-up.component';
import { TextTransformPipe } from './modules/COCO/intents/intent.pipe';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AgentSettingsComponent } from './modules/COCO/agent-settings/agent-settings.component';
import { SafeHtmlPipe } from './modules/COCO/add-edit-response-library/add-edit-response-library.pipe';
import { ConfigureLogs } from './modules/COCO/agent-settings/configure-pop-up/configure-pop-up.component';
import { MarkEntityPipe } from './modules/COCO/intents/edit-intents/mark-entity.pipe';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BackPopupComponent } from './modules/COCO/back-popup/back-popup.component';

// import { OrganizationAnalyticsComponent } from './modules/COCO/analytics/organization-analytics/organization-analytics.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    AccountComponent,
    UserManagementComponent,
    OrganizationManagementComponent,
    AddEditMemberComponent,
    BrainsComponent,
    SafeHtmlPipe,
    InsightsComponent,
    DataRelationshipComponent,
    AccessKeysComponent,
    SettingsComponent,
    EntitiesComponent,
    IntentsComponent,
    TextTransformPipe,
    ResponseLibraryComponent,
    IntegrationsComponent,
    CoordinatorComponent,
    PublishComponent,
    AddEditEntitiesComponent,
    AddEditIntentsComponent,
    ConfigureLogs,
    AddEditApiIntegrationsComponent,
    AddEditCoordinatorComponent,
    AddEditResponseLibraryComponent,
    OddMessageCardComponent,
    OddMessageFormComponent,
    ListViewCardComponent,
    ListViewFormComponent,
    LoginCardComponent,
    LoginFormComponent,
    PropertyDetailsCardComponent,
    PropertyDetailsFormComponent,
    NotificationComponent,
    TutorialComponent,
    DevEventModuleComponent,
    UserManagementSubComponentComponent,
    GraphComponent,
    GlobalEntitiesComponent,
    CustomEntitiesComponent,
    AvailableApiComponent,
    MappedCoordinatorComponent,
    AvailableCoordinatorComponent,
    ReadyToPublishComponent,
    PublishHistoryComponent,
    MarkEntityPipe,

    // OrganizationAnalyticsComponent,
    OrganizationDetailUpdateComponent,
    DeletePopUpComponent,
    EditEntitiesComponent,
    UploadFilePopUpComponent,
    ViewEntitiesComponent,
    EditIntentsComponent,
    ViewIntentsComponent,
    AddSlotPopUpComponent,
    AgentSettingsComponent,
    BackPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    EditorModule,
    HttpClientModule,
    Ng5SliderModule,
    FormsModule,
    NgbModule,
    NgxUiLoaderModule,
    SlickCarouselModule,
    NgSelectModule,
    ClickOutsideModule,
    NgxFileDragDropModule,
    TooltipModule

  ],
  providers: [
    AuthService,
    UserService,
    OrganizationService,
    HomeService,
    AppService,
    BotService,
    ISEntitiesService,
    ISCoordinatorService,
    ISIntegrationsService,
    ISIntentsService,
    ISPublishService,
    ISResponseLibraryService,
    LensDataRelationShipService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    LensBrainsService,
  ],
  bootstrap: [AppComponent],
  exports: [
    AddEditMemberComponent,
    NgbModule,
    NgxUiLoaderModule,
    AddEditEntitiesComponent,
    AddEditIntentsComponent,
    DeletePopUpComponent,


    // AddEditAgentComponent
  ],
  entryComponents: [
    AddEditMemberComponent,
    AddEditAgentComponent,
    AddEditEntitiesComponent,
    AddEditIntentsComponent,
    AddEditCoordinatorComponent,
    DeletePopUpComponent,
  ],
})
export class AppModule {}
