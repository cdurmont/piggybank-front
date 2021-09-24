import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import IPermission from "../../shared/models/IPermission";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private serviceUrl:string = `${environment.backendUrl}/permissions`;

  constructor(private httpClient: HttpClient) { }

  create(perm: IPermission): Observable<IPermission> {
    return this.httpClient.post(this.serviceUrl, perm);
  }

  read(permFilter: IPermission): Observable<IPermission[]> {
    return this.httpClient.get<IPermission[]>(this.serviceUrl, { params: { filter: JSON.stringify(permFilter)}});
  }

  update(perm: IPermission): Observable<IPermission> {
    return this.httpClient.put(`${this.serviceUrl}/${perm._id}`, perm);
  }

  delete(perm: IPermission): Observable<{}> {
    return this.httpClient.delete(`${this.serviceUrl}/${perm._id}`);
  }
}
