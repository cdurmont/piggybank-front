import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";

import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from 'primeng/toolbar';
import {MenuModule} from 'primeng/menu';
import {SplitButtonModule} from 'primeng/splitbutton';

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
    ToolbarModule,
    MenuModule,
    SplitButtonModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
