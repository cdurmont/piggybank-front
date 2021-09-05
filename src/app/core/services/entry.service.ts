import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import IEntry from "../../shared/models/IEntry";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Patch} from "../../shared/models/patch";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private serviceUrl:string = `${environment.backendUrl}/entries`;

  constructor(private httpClient: HttpClient) { }

  create(entry: IEntry): Observable<IEntry> {
    return this.httpClient.post(this.serviceUrl, entry);
  }

  read(entryFilter: IEntry): Observable<IEntry[]> {
    return this.httpClient.get<IEntry[]>(this.serviceUrl, { params: { filter: JSON.stringify(entryFilter)}})
      .pipe(map(entries => {
        entries.forEach(entry => {
          if (entry.date) entry.date = new Date(entry.date);
          if (entry.transaction) {
            if (entry.transaction.recurStartDate) entry.transaction.recurStartDate = new Date(entry.transaction.recurStartDate);
            if (entry.transaction.recurEndDate) entry.transaction.recurEndDate = new Date(entry.transaction.recurEndDate);
            if (entry.transaction.recurNextDate) entry.transaction.recurNextDate = new Date(entry.transaction.recurNextDate);
          }
        });
        return entries;
      }));
  }

  readDetailed(entryFilter: IEntry): Observable<IEntry[]> {
    return this.httpClient.get<IEntry[]>(`${this.serviceUrl}/detailed`, { params: { filter: JSON.stringify(entryFilter)}});
  }

  update(entry: IEntry): Observable<{}> {
    return this.httpClient.put(`${this.serviceUrl}/${entry._id}`, entry);
  }

  batchUpdate(filter: IEntry, set: IEntry): Observable<{}> {
    let patch: Patch<IEntry> = {
      filter: filter,
      set: set
    };
    return this.httpClient.patch(this.serviceUrl, patch);
  }

  delete(entry: IEntry): Observable<{}> {
    return this.httpClient.delete(`${this.serviceUrl}/${entry._id}`);
  }
}
