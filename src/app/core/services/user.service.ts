import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import IUser from "../../shared/models/IUser";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serviceUrl:string = `${environment.backendUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  update(user: IUser): Observable<IUser> {
    return this.httpClient.put(`${this.serviceUrl}/${user._id}`, user);
  }

  read(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(this.serviceUrl);
  }
}
