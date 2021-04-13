import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule,HTTP_INTERCEPTORS } from "@angular/common/http";

import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from "primeng/toast";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './features/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ErrorIntercept,
    //   multi: true
    // }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
