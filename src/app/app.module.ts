import {APP_INITIALIZER, NgModule} from '@angular/core';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";


import { LoginComponent } from './features/login/login.component';
import { AccountsComponent } from './features/accounts/accounts.component';
import {AuthInterceptor} from "./core/auth.interceptor";
import { PreferencesComponent } from './features/preferences/preferences.component';

import { PrimeImportsModule } from "./shared/prime-imports/prime-imports.module";
import {SharedComponentsModule} from "./shared/shared-components/shared-components.module";
import { QuickinputsComponent } from './features/quickinputs/quickinputs.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {initializeKeycloak} from "./init/keycloak-init.factory";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AccountsComponent,
        PreferencesComponent,
        QuickinputsComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        PrimeImportsModule,
        SharedComponentsModule,
        KeycloakAngularModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),


    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
      {
        provide: APP_INITIALIZER,
        useFactory: initializeKeycloak,
        multi: true,
        deps: [KeycloakService],
      }
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }
