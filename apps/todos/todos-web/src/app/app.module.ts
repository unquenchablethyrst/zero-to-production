import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedDataAccessApiModule } from '@uqt/shared/data-access/api';
import {
  SharedAuthDataAccessModule,
  authProviderFactory,
  AuthService
} from '@uqt/shared/data-access/auth';
import { SharedUsersDataAccessModule } from '@uqt/shared/users/data-access';
import { TodosFeatureShellModule } from '@uqt/todos/feature-shell';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { AppEffects } from './+state/app.effects';
import { AppState, appReducerMap } from './+state/app.state';
import { CommonDynamicFormModule } from '@uqt/common/dynamic-form';
import { CommonDynamicFormMaterialComponentsModule } from '@uqt/common/dynamic-form-material-components';
import { APP_COMPONENTS, APP_ERRORS } from './app.dynamic-form';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot<AppState>(appReducerMap, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal
    }),
    SharedDataAccessApiModule.forRoot(environment),
    SharedAuthDataAccessModule.forRoot({
      authServerUrl: environment.serverUrl
    }),
    SharedUsersDataAccessModule.forRoot(),
    CommonDynamicFormModule.forRoot({
      components: APP_COMPONENTS,
      errors: APP_ERRORS
    }),
    CommonDynamicFormMaterialComponentsModule,
    AppRoutingModule.forRoot(),
    TodosFeatureShellModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: authProviderFactory,
      multi: true,
      deps: [AuthService]
    }
  ]
})
export class AppModule {}
