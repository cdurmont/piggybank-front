import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountsComponent,
    PreferencesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    PrimeImportsModule,

  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    },
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
