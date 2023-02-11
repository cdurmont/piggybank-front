import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsComponent } from './account-details.component';
import {AccountPropertiesComponent} from "./account-properties/account-properties.component";
import {StatsComponent} from "./stats/stats.component";

const routes: Routes = [
  { path: 'details/:id', component: AccountDetailsComponent },
  { path: 'create', component: AccountPropertiesComponent },
  { path: 'properties/:id', component: AccountPropertiesComponent },
  { path: 'stats/:id', component: StatsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountDetailsRoutingModule { }
