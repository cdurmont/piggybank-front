import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from "./features/accounts/accounts.component";
import {PreferencesComponent} from "./features/preferences/preferences.component";
import {QuickinputsComponent} from "./features/quickinputs/quickinputs.component";

const routes: Routes = [
  { path: '', component: AccountsComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'quickInputs', component: QuickinputsComponent},
  { path: 'admin/users', loadChildren: () => import('./features/admin-users/admin-users.module').then(m => m.AdminUsersModule) },
  { path: 'accounts', loadChildren: () => import('./features/account-details/account-details.module').then(m => m.AccountDetailsModule) },
  { path: 'transactions', loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule) },
  { path: 'import', loadChildren: () => import('./features/import/import.module').then(m => m.ImportModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
