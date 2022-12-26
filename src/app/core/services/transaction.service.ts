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
  constructor(private httpClient: HttpClient) { }

  create(instanceId: number, txn: ITransaction): Observable<ITransaction> {
    return this.httpClient.post(`${environment.backendUrl}/${instanceId}/transactions`, txn);
  }

  read(instanceId: number, txnFilter: ITransaction): Observable<ITransaction[]> {
    return this.httpClient.get<ITransaction[]>(`${environment.backendUrl}/${instanceId}/transactions`, { params: { filter: JSON.stringify(txnFilter)}})
      .pipe(map(transactions => {
        transactions.forEach(txn => {
          if (txn.recurStartDate) txn.recurStartDate = new Date(txn.recurStartDate);
          if (txn.recurEndDate) txn.recurEndDate = new Date(txn.recurEndDate);
          if (txn.recurNextDate) txn.recurNextDate = new Date(txn.recurNextDate);
        });
        return transactions;
      }));
  }

  getById(instanceId: number, id: number): Observable<ITransaction> {
    return this.httpClient.get<ITransaction>(`${environment.backendUrl}/${instanceId}/transactions/${id}`)
      .pipe(map(txn => {
          if (txn.recurStartDate) txn.recurStartDate = new Date(txn.recurStartDate);
          if (txn.recurEndDate) txn.recurEndDate = new Date(txn.recurEndDate);
          if (txn.recurNextDate) txn.recurNextDate = new Date(txn.recurNextDate);
          return txn;
        }));
  }

  update(instanceId: number, txn: ITransaction): Observable<ITransaction> {
    return this.httpClient.put(`${environment.backendUrl}/${instanceId}/transactions/${txn.id}`, txn);
  }

  delete(instanceId: number, txn: ITransaction): Observable<{}> {
    return this.httpClient.delete(`${environment.backendUrl}/${instanceId}/transactions/${txn.id}`);
  }
}
