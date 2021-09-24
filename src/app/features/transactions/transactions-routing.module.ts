import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import {RecurComponent} from "./recur/recur.component";

const routes: Routes = [
  { path: 'create/:id', component: TransactionsComponent },
  { path: 'createRecur', component: TransactionsComponent },
  { path: 'createQuick', component: TransactionsComponent },
  { path: 'useQuickInput/:id', component: TransactionsComponent },
  { path: 'update/:id', component: TransactionsComponent },
  { path: 'recurring', component: RecurComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
