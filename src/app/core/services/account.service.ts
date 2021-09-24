import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import IAccount from "../../shared/models/IAccount";
import {BehaviorSubject, Observable} from "rxjs";
import IUser from "../../shared/models/IUser";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private serviceUrl:string = `${environment.backendUrl}/accounts`;

  private rootAccountsSubject: BehaviorSubject<IAccount[]>;


  constructor(private httpClient: HttpClient) {
    let rootAccountsJson:string = localStorage.getItem('rootAccounts') || '[]'; // retrieve from local storage if present
    const rootAccounts:IAccount[] = JSON.parse(rootAccountsJson);
    this.rootAccountsSubject = new BehaviorSubject<IAccount[]>(rootAccounts);
  }

  read(accountFilter: IAccount): Observable<IAccount[]> {
    if (this.rootAccountsSubject.getValue().length>0 && accountFilter.parent && !accountFilter.parent._id)  // filter with parent with no id => fetch root accounts
      return this.rootAccountsSubject.asObservable();
    return this.httpClient.get<IAccount[]>(this.serviceUrl, {params: {filter: JSON.stringify(accountFilter)}})
      .pipe(map(accounts => {
        if (accountFilter.parent && !accountFilter.parent._id) {
          // root accounts ! let's cache it
          localStorage.setItem('rootAccounts', JSON.stringify(accounts));
          this.rootAccountsSubject.next(accounts);
        }
        return accounts;
      }))
      ;
  }

  updateCache(rootAccounts: IAccount[]): void {
    localStorage.setItem('rootAccounts', JSON.stringify(rootAccounts));
    this.rootAccountsSubject.next(rootAccounts);
  }

  forceReload(): void {
    localStorage.setItem('rootAccounts', JSON.stringify([]));
    this.rootAccountsSubject.next([]);
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
