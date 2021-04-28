import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountDetailsRoutingModule } from './account-details-routing.module';
import { AccountDetailsComponent } from './account-details.component';
import { PrimeImportsModule } from "../../shared/prime-imports/prime-imports.module";
import { AccountPropertiesComponent } from './account-properties/account-properties.component';
import { AccountSelectorComponent } from '../../shared/components/account-selector/account-selector.component';


@NgModule({
  declarations: [
    AccountDetailsComponent,
    AccountPropertiesComponent,
    AccountSelectorComponent,
  ],
    imports: [
        CommonModule,
        AccountDetailsRoutingModule,
        PrimeImportsModule,
    ]
})
export class AccountDetailsModule { }
