import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountSelectorComponent} from "../components/account-selector/account-selector.component";
import {PrimeImportsModule} from "../prime-imports/prime-imports.module";



@NgModule({
  declarations: [
    AccountSelectorComponent
  ],
  imports: [
    CommonModule,
    PrimeImportsModule
  ],
  exports: [
    AccountSelectorComponent
  ]
})
export class SharedComponentsModule { }
