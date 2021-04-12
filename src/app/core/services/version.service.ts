import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from "../../../environments/environment";
import Version from "../../shared/models/version";

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private httpClient: HttpClient) { }

  getVersion(): Observable<Version> {
    return this.httpClient.get<Version>(`${environment.backendUrl}/version`);
  }

}

