import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from "./features/accounts/accounts.component";
import {PreferencesComponent} from "./features/preferences/preferences.component";

const routes: Routes = [
  { path: '', component: AccountsComponent },
  { path: 'preferences', component: PreferencesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
