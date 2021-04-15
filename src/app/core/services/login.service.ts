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
  private apikeyCache: string | undefined;

  constructor(private httpClient: HttpClient) {
    let userJson:string = localStorage.getItem('user') || '{}'; // retrieve from local storage if present
    const user:IUser = JSON.parse(userJson);
    this.userSubject = new BehaviorSubject<IUser>(user);
    this.apikeyCache = user.apikey;
  }

  getUser():Observable<IUser> {
    return this.userSubject.asObservable();
  }

  login(user:IUser):Observable<IUser> {
    return this.httpClient.post<IUser>(this.serviceUrl, user)
      .pipe(map(user => {
        console.log('login received '+ JSON.stringify(user));
        // store user details in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.apikeyCache = user.apikey;
        this.userSubject.next(user);
        return user;
      }));
  }

  getApikey():string {
    return this.apikeyCache || '';
  }
}
