import { Component, OnInit } from '@angular/core';
import IUser from "../../shared/models/IUser";
import {LoginService} from "../../core/services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:IUser = {};  // input support

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  login(): void {
    console.log('User login' + JSON.stringify(this.user));
    this.loginService.login(this.user).subscribe(loggedUser => {
      this.user = loggedUser;
    })
  }
}
