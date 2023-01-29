import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from "./features/accounts/accounts.component";
import {PreferencesComponent} from "./features/preferences/preferences.component";
import {QuickinputsComponent} from "./features/quickinputs/quickinputs.component";
import {AuthGuard} from "./guard/auth.guard";
import {MaquetteComponent} from "./maquette/maquette.component";
import {HomeComponent} from "./features/home/home.component";

const routes: Routes = [
  { path: 'allAccounts', component: AccountsComponent, canActivate: [AuthGuard]/*, data: {roles: ['bozo']}*/ },
  { path: 'preferences', component: PreferencesComponent, canActivate: [AuthGuard] },
  { path: 'quickInputs', component: QuickinputsComponent, canActivate: [AuthGuard]},
  { path: 'maquette', component: MaquetteComponent, canActivate: [AuthGuard]},
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'admin/users', loadChildren: () => import('./features/admin-users/admin-users.module').then(m => m.AdminUsersModule), canActivate: [AuthGuard] },
  { path: 'accounts', loadChildren: () => import('./features/account-details/account-details.module').then(m => m.AccountDetailsModule), canActivate: [AuthGuard] },
  { path: 'transactions', loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule), canActivate: [AuthGuard] },
  { path: 'import', loadChildren: () => import('./features/import/import.module').then(m => m.ImportModule), canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
