import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import ITransaction from "../../shared/models/ITransaction";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private serviceUrl:string = `${environment.backendUrl}/transactions`;
  constructor(private httpClient: HttpClient) { }

  create(txn: ITransaction): Observable<ITransaction> {
    return this.httpClient.post(this.serviceUrl, txn);
  }

  update(txn: ITransaction): Observable<{}> {
    return this.httpClient.put(`${this.serviceUrl}/${txn._id}`, txn);
  }

  delete(txn: ITransaction): Observable<{}> {
    return this.httpClient.delete(`${this.serviceUrl}/${txn._id}`);
  }
}
