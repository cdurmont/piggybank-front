import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import IUser from "../../shared/models/IUser";
import {Observable} from "rxjs";
import {reduce} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serviceUrl:string = `${environment.backendUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  create(user: IUser): Observable<IUser> {
    return this.httpClient.post(this.serviceUrl, user);
  }

  read(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(this.serviceUrl);
  }

  update(user: IUser): Observable<IUser> {
    return this.httpClient.put(`${this.serviceUrl}/${user._id}`, user);
  }

  delete(user: IUser): Observable<{}> {
    return this.httpClient.delete(`${this.serviceUrl}/${user._id}`);
  }

  getById(id: string): Observable<IUser[]> {
    let user:IUser = {_id: id};
    return this.httpClient.get<IUser[]>(this.serviceUrl, {params: {filter: JSON.stringify(user)}});
  }
}
