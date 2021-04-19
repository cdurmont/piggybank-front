import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminUsersRoutingModule } from './admin-users-routing.module';
import { AdminUsersComponent } from './admin-users.component';
import {PrimeImportsModule} from "../../shared/prime-imports/prime-imports.module";
import { UserDetailComponent } from './user-detail/user-detail.component';


@NgModule({
  declarations: [
    AdminUsersComponent,
    UserDetailComponent
  ],
    imports: [
        CommonModule,
        AdminUsersRoutingModule,
        PrimeImportsModule
    ]
})
export class AdminUsersModule { }
