import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import {PrimeImportsModule} from "../../shared/prime-imports/prime-imports.module";
import {SharedComponentsModule} from "../../shared/shared-components/shared-components.module";


@NgModule({
  declarations: [
    ImportComponent
  ],
    imports: [
        CommonModule,
        ImportRoutingModule,
        PrimeImportsModule,
        SharedComponentsModule,
    ]
})
export class ImportModule { }
