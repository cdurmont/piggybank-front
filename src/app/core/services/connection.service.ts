import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Connection} from "../../shared/models/connection.model";
import ITransaction from "../../shared/models/ITransaction";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private httpClient: HttpClient) { }

  createPublicToken()  {
    return this.httpClient.post<{message: string, token: string, environment: string}>(`${environment.linkUrl}/link-token`,{});
  }
  create(publicToken: string, syncStartDate: Date, instance: number) {
    return this.httpClient.post<{message: string, accessToken: string}>(`${environment.linkUrl}/connection`,{publicToken: publicToken, syncStartDate: syncStartDate, instance: instance});
  }

  read() {
    return this.httpClient.get<Connection[]>(`${environment.linkUrl}/connection`);
  }

  delete(connection: Connection) {
    return this.httpClient.delete<{message: string, accessToken: string}>(`${environment.linkUrl}/connection/${connection.itemId}/${connection.accessToken}`);
  }

  update(connection: Connection) {
    return this.httpClient.patch<Connection>(`${environment.linkUrl}/connection/${connection.itemId}`, connection);
  }

  sync() {
    return this.httpClient.post<ITransaction[]>(`${environment.linkUrl}/transaction/sync`,{});
  }
}
