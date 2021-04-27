import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {MenuModule} from "primeng/menu";
import {SplitButtonModule} from "primeng/splitbutton";
import {TableModule} from "primeng/table";
import {TreeTableModule} from "primeng/treetable";
import {PasswordModule} from "primeng/password";
import {InputSwitchModule} from 'primeng/inputswitch';
import {ContextMenuModule} from "primeng/contextmenu";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";

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
    FormsModule,
    InputSwitchModule,
    ContextMenuModule,
    ConfirmDialogModule,
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
    InputSwitchModule,
    ContextMenuModule,
    ConfirmDialogModule,
  ],
  providers: [ ConfirmationService ]
})
export class PrimeImportsModule { }
