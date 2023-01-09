import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import IAssociation from "../../shared/models/IAssociation";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  getServiceUrl(instanceId: number): string {
    return `${environment.backendUrl}/${instanceId}/associations`;
  }
  constructor(private httpClient: HttpClient) { }

  create(instanceId:number, assoc: IAssociation): Observable<IAssociation> {
    // @ts-ignore
    return this.httpClient.post(this.getServiceUrl(instanceId), assoc);
  }

  read(instanceId:number, assocFilter: any): Observable<IAssociation[]> {
    return this.httpClient.get<IAssociation[]>(this.getServiceUrl(instanceId), { params: { filter: JSON.stringify(assocFilter)}});
  }

  update(instanceId:number,assoc: IAssociation): Observable<IAssociation> {
    // @ts-ignore
    return this.httpClient.put(`${this.getServiceUrl(instanceId)}/${assoc._id}`, assoc);
  }

  delete(instanceId:number,assoc: IAssociation): Observable<{}> {
    return this.httpClient.delete(`${this.getServiceUrl(instanceId)}/${assoc._id}`);
  }
}
