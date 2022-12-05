import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import IPermission from "../../shared/models/IPermission";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private httpClient: HttpClient) { }

  create(instanceId: number, perm: IPermission): Observable<IPermission> {
    return this.httpClient.post(`${environment.backendUrl}/${instanceId}/permissions`, perm);
  }

  read(instanceId: number, permFilter: IPermission): Observable<IPermission[]> {
    return this.httpClient.get<IPermission[]>(`${environment.backendUrl}/${instanceId}/permissions`, { params: { filter: JSON.stringify(permFilter)}});
  }

  update(instanceId: number, perm: IPermission): Observable<IPermission> {
    return this.httpClient.put(`${environment.backendUrl}/${instanceId}/permissions/${perm.id}`, perm);
  }

  delete(instanceId: number, perm: IPermission): Observable<{}> {
    return this.httpClient.delete(`${environment.backendUrl}/${instanceId}/permissions/${perm.id}`);
  }
}
