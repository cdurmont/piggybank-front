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
    return this.httpClient.get<IAccount[]>(this.serviceUrl);
  }
}
