import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersComponent } from './admin-users.component';
import {UserDetailComponent} from "./user-detail/user-detail.component";

const routes: Routes = [
  { path: '', component: AdminUsersComponent },
  { path: 'update/:id', component: UserDetailComponent },
  { path: 'create', component: UserDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminUsersRoutingModule { }
