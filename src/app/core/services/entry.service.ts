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


  constructor(private httpClient: HttpClient) { }

  create(instanceId: number, entry: IEntry): Observable<IEntry> {
    return this.httpClient.post(`${environment.backendUrl}/${instanceId}/entries`, entry);
  }

  read(instanceId: number, entryFilter: IEntry): Observable<IEntry[]> {
    return this.httpClient.get<IEntry[]>(`${environment.backendUrl}/${instanceId}/entries`, { params: { filter: JSON.stringify(entryFilter)}})
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

  readDetailed(instanceId: number, entryFilter: IEntry, reconciled: boolean): Observable<IEntry[]> {
    return this.httpClient.get<IEntry[]>(`${environment.backendUrl}/${instanceId}/entries/detailed`, { params: { filter: JSON.stringify(entryFilter), reconciled: reconciled}});
  }

  update(instanceId: number, entry: IEntry): Observable<{}> {
    return this.httpClient.put(`${environment.backendUrl}/${instanceId}/entries/${entry.id}`, entry);
  }

  batchUpdate(instanceId: number, filter: IEntry, set: IEntry): Observable<{}> {
    let patch: Patch<IEntry> = {
      filter: filter,
      set: set
    };
    return this.httpClient.patch(`${environment.backendUrl}/${instanceId}/entries`, patch);
  }

  delete(instanceId: number, entry: IEntry): Observable<{}> {
    return this.httpClient.delete(`${environment.backendUrl}/${instanceId}/entries/${entry.id}`);
  }
}
