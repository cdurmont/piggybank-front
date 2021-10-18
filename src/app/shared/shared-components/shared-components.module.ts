import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AccountSelectorComponent} from "../components/account-selector/account-selector.component";
import {PrimeImportsModule} from "../prime-imports/prime-imports.module";
import {BalanceComponent} from "../components/balance/balance.component";


@NgModule({
  declarations: [
    AccountSelectorComponent,
    BalanceComponent,
  ],
  imports: [
    CommonModule,
    PrimeImportsModule
  ],
  exports: [
    AccountSelectorComponent,
    BalanceComponent,
  ]
})
export class SharedComponentsModule { }
