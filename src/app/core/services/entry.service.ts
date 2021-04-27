import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import IEntry from "../../shared/models/IEntry";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private serviceUrl:string = `${environment.backendUrl}/entries`;

  constructor(private httpClient: HttpClient) { }

  read(entryFilter: IEntry): Observable<IEntry[]> {
    return this.httpClient.get<IEntry[]>(this.serviceUrl, { params: { filter: JSON.stringify(entryFilter)}});
  }

  readDetailed(entryFilter: IEntry): Observable<IEntry[]> {
    return this.httpClient.get<IEntry[]>(`${this.serviceUrl}/detailed`, { params: { filter: JSON.stringify(entryFilter)}});
  }
}
