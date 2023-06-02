import { AgentSettingsComponent } from './modules/COCO/agent-settings/agent-settings.component';
import { AddEditResponseLibraryComponent } from './modules/COCO/add-edit-response-library/add-edit-response-library.component';
import { IntentsComponent } from './modules/COCO/intents/intents.component';
import { IntegrationsComponent } from './modules/COCO/integrations/integrations.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoordinatorComponent } from './modules/COCO/coordinator/coordinator.component';
import { EntitiesComponent } from './modules/COCO/entities/entities.component';
import { RouteGuard } from './modules/core/guards/router.guard';
import { LayoutComponent } from './modules/core/layout/layout.component';
import { AccessKeysComponent } from './modules/lens/access-keys/access-keys.component';
import { BrainsComponent } from './modules/lens/brains/brains.component';
import { DataRelationshipComponent } from './modules/lens/data-relationship/data-relationship.component';
import { InsightsComponent } from './modules/lens/insights/insights.component';
import { SettingsComponent } from './modules/lens/settings/settings.component';
import { LoginComponent } from './modules/login/login.component';
import { OrganizationManagementComponent } from './modules/organization-management/organization-management.component';
import { UserManagementComponent } from './modules/user-management/user-management.component';
import { PublishComponent } from './modules/COCO/publish/publish.component';
import { ResponseLibraryComponent } from './modules/COCO/response-library/response-library.component';
// import { HistoryComponent } from './modules/lens/progress-execution/history/history.component';
// import { ProgressExecutionComponent } from './modules/lens/progress-execution/progress-execution.component';

const routes: Routes = [
  {
    path: 'login/signup',
    component: LoginComponent,
  },
  {
    path: 'login/verifyMail',
    component: LoginComponent,
  },
  {
    path: 'login/reset',
    component: LoginComponent,
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [RouteGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./modules/analytics/analytics.module').then(
            (m) => m.AnalyticsModule
          ),
      },
      {
        path: 'subscription',
        loadChildren: () =>
          import('./modules/subscription/subscription.module').then(
            (m) => m.SubscriptionModule
          ),
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./modules/analytics/analytics.module').then(
            (m) => m.AnalyticsModule
          ),
      },

      {
        path: 'channel-integration',
        loadChildren: () =>
          import(
            './modules/COCO/channel-integration/channel-integration.module'
          ).then((m) => m.ChannelIntegrationModule),
      },
      {
        path: 'progress-execution',
        loadChildren: () =>
          import(
            './modules/lens/progress-execution/progress-execution.module'
          ).then((m) => m.ProgressExecutionModule),
      },
      { path: 'user', component: UserManagementComponent },
      { path: 'organization', component: OrganizationManagementComponent },
      { path: 'brains', component: BrainsComponent },
      { path: 'insights', component: InsightsComponent },
      { path: 'accessKey', component: AccessKeysComponent },
      { path: 'lens-settings', component: SettingsComponent },
      { path: 'data-relationship', component: DataRelationshipComponent },
      { path: 'entities', component: EntitiesComponent },
      { path: 'coordinator', component: CoordinatorComponent },
      { path: 'integrations', component: IntegrationsComponent },
      { path: 'intents', component: IntentsComponent },
      { path: 'publish', component: PublishComponent },
      { path: 'agent-settings', component: AgentSettingsComponent },
      { path: 'response-library', component: ResponseLibraryComponent },
      {
        path: 'response-library/:intentName/:intentTypeId',
        component: AddEditResponseLibraryComponent,
      },
    ],
  },
  {
    path: 'progress-execution',
    loadChildren: () =>
      import(
        './modules/lens/progress-execution/progress-execution.module'
      ).then((m) => m.ProgressExecutionModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
