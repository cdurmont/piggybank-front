import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import IAccount from "../../shared/models/IAccount";
import {BehaviorSubject, Observable} from "rxjs";
import IUser from "../../shared/models/IUser";
import {map} from "rxjs/operators";
import IEntry from "../../shared/models/IEntry";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private rootAccountsSubject: BehaviorSubject<IAccount[]>;


  constructor(private httpClient: HttpClient) {
    let rootAccountsJson:string = localStorage.getItem('rootAccounts') || '[]'; // retrieve from local storage if present
    const rootAccounts:IAccount[] = JSON.parse(rootAccountsJson);
    this.rootAccountsSubject = new BehaviorSubject<IAccount[]>(rootAccounts);
  }

  getServiceUrl(instanceId: number): string {
    return `${environment.backendUrl}/${instanceId}/accounts`;
  }

  read(instanceId: number, accountFilter: IAccount): Observable<IAccount[]> {
    // if (this.rootAccountsSubject.getValue().length>0 && accountFilter.parent && !accountFilter.parent._id)  // filter with parent with no id => fetch root accounts
    //   return this.rootAccountsSubject.asObservable();
    return this.httpClient.get<IAccount[]>(this.getServiceUrl(instanceId), {params: {filter: JSON.stringify(accountFilter)}})
      .pipe(map(accounts => {
        if (accountFilter.parent && !accountFilter.parent.id) {
          // root accounts ! let's cache it
          localStorage.setItem('rootAccounts', JSON.stringify(accounts));
          this.rootAccountsSubject.next(accounts);
        }
        return accounts;
      }))
      ;
  }

  readTree(instanceId: number): Observable<IAccount[]> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.get<IAccount[]>(`${serviceUrl}/tree`);
  }

  updateCache(rootAccounts: IAccount[]): void {
    localStorage.setItem('rootAccounts', JSON.stringify(rootAccounts));
    this.rootAccountsSubject.next(rootAccounts);
  }

  forceReload(): void {
    localStorage.setItem('rootAccounts', JSON.stringify([]));
    this.rootAccountsSubject.next([]);
  }

  getBalance(instanceId: number, account: IAccount): Observable<any> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.get(`${serviceUrl}/${account.id}/balance`);
  }

  getStats(instanceId: number, account: IAccount): Observable<any> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.get(`${serviceUrl}/${account.id}/stats`);
  }

  delete(instanceId: number, account: IAccount): Observable<{}> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.delete(`${serviceUrl}/${account.id}`);
  }

  update(instanceId: number, account: IAccount): Observable<{}> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.put(`${serviceUrl}/${account.id}`,account);
  }

  create(instanceId: number, account: IAccount): Observable<IAccount> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.post(`${serviceUrl}`,account);
  }

  readEntries(instanceId: number, accountId: string | null, showReconciled: boolean, page: number, pageSize: number): Observable<IEntry[]> {
    const serviceUrl: string = this.getServiceUrl(instanceId);
    return this.httpClient.get<IEntry[]>(`${serviceUrl}/${accountId}/entries`,{params: {showReconciled: showReconciled, page: page, size: pageSize}});
  }
}
