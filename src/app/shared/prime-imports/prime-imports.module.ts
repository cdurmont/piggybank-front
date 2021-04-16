import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {MenuModule} from "primeng/menu";
import {SplitButtonModule} from "primeng/splitbutton";
import {TableModule} from "primeng/table";
import {TreeTableModule} from "primeng/treetable";
import {PasswordModule} from "primeng/password";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    MenuModule,
    SplitButtonModule,
    TableModule,
    TreeTableModule,
    PasswordModule,
    FormsModule

  ],
  exports: [
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

  ]
})
export class PrimeImportsModule { }
