import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import {PrimeImportsModule} from "../../shared/prime-imports/prime-imports.module";
import {SharedComponentsModule} from "../../shared/shared-components/shared-components.module";
import { RecurComponent } from './recur/recur.component';


@NgModule({
  declarations: [
    TransactionsComponent,
    RecurComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    PrimeImportsModule,
    SharedComponentsModule,
  ]
})
export class TransactionsModule { }
