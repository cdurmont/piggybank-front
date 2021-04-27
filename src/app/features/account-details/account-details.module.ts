import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountDetailsRoutingModule } from './account-details-routing.module';
import { AccountDetailsComponent } from './account-details.component';
import { PrimeImportsModule } from "../../shared/prime-imports/prime-imports.module";


@NgModule({
  declarations: [
    AccountDetailsComponent
  ],
    imports: [
        CommonModule,
        AccountDetailsRoutingModule,
        PrimeImportsModule,
    ]
})
export class AccountDetailsModule { }
