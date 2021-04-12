import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import { map } from 'rxjs/operators';

import IUser from "../../shared/models/IUser";
import {HttpClient} from "@angular/common/http";

import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private serviceUrl:string = `${environment.backendUrl}/login`;
  private userSubject: BehaviorSubject<IUser>;

  constructor(private httpClient: HttpClient) {
    let userJson:string = localStorage.getItem('user') || '{}'; // retrieve from local storage if present
    this.userSubject = new BehaviorSubject<IUser>(JSON.parse(userJson));
  }

  getUser():Observable<IUser> {
    return this.userSubject.asObservable();
  }

  login(user:IUser):Observable<IUser> {
    console.log('login service');
    return this.httpClient.post<IUser>(this.serviceUrl, user)
      .pipe(map(user => {
        console.log('login received '+ JSON.stringify(user));
        // store user details in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }
}
