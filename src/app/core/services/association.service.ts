import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import IAssociation from "../../shared/models/IAssociation";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  private serviceUrl:string = `${environment.backendUrl}/associations`;

  constructor(private httpClient: HttpClient) { }

  create(assoc: IAssociation): Observable<IAssociation> {
    // @ts-ignore
    return this.httpClient.post(this.serviceUrl, assoc);
  }

  read(assocFilter: any): Observable<IAssociation[]> {
    return this.httpClient.get<IAssociation[]>(this.serviceUrl, { params: { filter: JSON.stringify(assocFilter)}});
  }

  update(assoc: IAssociation): Observable<IAssociation> {
    // @ts-ignore
    return this.httpClient.put(`${this.serviceUrl}/${assoc._id}`, assoc);
  }

  delete(assoc: IAssociation): Observable<{}> {
    return this.httpClient.delete(`${this.serviceUrl}/${assoc._id}`);
  }
}
