import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from 'primeng/toolbar';
import {MenuModule} from 'primeng/menu';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TableModule} from 'primeng/table';
import {TreeTableModule} from 'primeng/treetable';
import {PasswordModule} from 'primeng/password';

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './features/login/login.component';
import { AccountsComponent } from './features/accounts/accounts.component';
import {AuthInterceptor} from "./core/auth.interceptor";
import { PreferencesComponent } from './features/preferences/preferences.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountsComponent,
    PreferencesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    MenuModule,
    SplitButtonModule,
    TableModule,
    TreeTableModule,
    PasswordModule,
    FormsModule,
    BrowserAnimationsModule
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
