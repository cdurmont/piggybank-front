import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import {PrimeImportsModule} from "../../shared/prime-imports/prime-imports.module";
import {SharedComponentsModule} from "../../shared/shared-components/shared-components.module";
import { ConnectionListComponent } from './connection-list/connection-list.component';
import {NgxPlaidLinkModule} from "ngx-plaid-link";


@NgModule({
  declarations: [
    ImportComponent,
    ConnectionListComponent
  ],
    imports: [
        CommonModule,
        ImportRoutingModule,
        PrimeImportsModule,
        SharedComponentsModule,
        NgxPlaidLinkModule,
    ]
})
export class ImportModule { }
