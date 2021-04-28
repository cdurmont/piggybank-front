import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import IAccount from "../../shared/models/IAccount";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private serviceUrl:string = `${environment.backendUrl}/accounts`;

  constructor(private httpClient: HttpClient) { }

  read(accountFilter: IAccount): Observable<IAccount[]> {
    return this.httpClient.get<IAccount[]>(this.serviceUrl, {params: {filter: JSON.stringify(accountFilter)}});
  }

  getBalance(account: IAccount): Observable<any> {
    return this.httpClient.get(`${this.serviceUrl}/${account._id}/balance`);
  }

  delete(account: IAccount): Observable<{}> {
    return this.httpClient.delete(`${this.serviceUrl}/${account._id}`);
  }

  update(account: IAccount): Observable<{}> {
    return this.httpClient.put(`${this.serviceUrl}/${account._id}`,account);
  }

  create(account: IAccount): Observable<IAccount> {
    return this.httpClient.post(`${this.serviceUrl}`,account);
  }
}
