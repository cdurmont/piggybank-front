import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import ITransaction from "../../shared/models/ITransaction";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private serviceUrl:string = `${environment.backendUrl}/transactions`;
  constructor(private httpClient: HttpClient) { }

  create(txn: ITransaction): Observable<ITransaction> {
    return this.httpClient.post(this.serviceUrl, txn);
  }

  read(txnFilter: ITransaction): Observable<ITransaction[]> {
    return this.httpClient.get<ITransaction[]>(this.serviceUrl, { params: { filter: JSON.stringify(txnFilter)}})
      .pipe(map(transactions => {
        transactions.forEach(txn => {
          if (txn.recurStartDate) txn.recurStartDate = new Date(txn.recurStartDate);
          if (txn.recurEndDate) txn.recurEndDate = new Date(txn.recurEndDate);
          if (txn.recurNextDate) txn.recurNextDate = new Date(txn.recurNextDate);
        });
        return transactions;
      }));
  }

  update(txn: ITransaction): Observable<{}> {
    return this.httpClient.put(`${this.serviceUrl}/${txn._id}`, txn);
  }

  delete(txn: ITransaction): Observable<{}> {
    return this.httpClient.delete(`${this.serviceUrl}/${txn._id}`);
  }
}
