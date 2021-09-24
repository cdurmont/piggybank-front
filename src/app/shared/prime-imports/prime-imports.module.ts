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
import {OverlayPanelModule} from "primeng/overlaypanel";
import {TreeModule} from "primeng/tree";
import {CalendarModule} from "primeng/calendar";
import {FileUploadModule} from "primeng/fileupload";
import {SelectButtonModule} from "primeng/selectbutton";
import {CheckboxModule} from "primeng/checkbox";
import {DialogModule} from 'primeng/dialog';

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
    OverlayPanelModule,
    TreeModule,
    CalendarModule,
    FileUploadModule,
    SelectButtonModule,
    CheckboxModule,
    DialogModule,
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
    OverlayPanelModule,
    TreeModule,
    CalendarModule,
    FileUploadModule,
    SelectButtonModule,
    CheckboxModule,
    DialogModule,
  ],
  providers: [ ConfirmationService ]
})
export class PrimeImportsModule { }
