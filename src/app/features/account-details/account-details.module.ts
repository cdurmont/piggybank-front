import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountDetailsRoutingModule } from './account-details-routing.module';
import { AccountDetailsComponent } from './account-details.component';
import { PrimeImportsModule } from "../../shared/prime-imports/prime-imports.module";
import { AccountPropertiesComponent } from './account-properties/account-properties.component';
import {SharedComponentsModule} from "../../shared/shared-components/shared-components.module";


@NgModule({
  declarations: [
    AccountDetailsComponent,
    AccountPropertiesComponent,
  ],
  exports: [

  ],
  imports: [
    CommonModule,
    AccountDetailsRoutingModule,
    PrimeImportsModule,
    SharedComponentsModule,
  ]
})
export class AccountDetailsModule { }
