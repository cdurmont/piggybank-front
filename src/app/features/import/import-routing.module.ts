import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportComponent } from './import.component';
import {ConnectionListComponent} from "./connection-list/connection-list.component";

const routes: Routes = [
  { path: '', component: ImportComponent },
  { path: 'connections', component: ConnectionListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
