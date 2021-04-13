import { Component, OnInit } from '@angular/core';
import { MessageService } from "primeng/api";
import IUser from "../../shared/models/IUser";
import {LoginService} from "../../core/services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:IUser = {};  // input support

  constructor(private loginService: LoginService,
              private messageService: MessageService) { }

  ngOnInit(): void {
  }

  login(): void {
    console.log('User login' + JSON.stringify(this.user));
    this.loginService.login(this.user).subscribe(loggedUser => {
      this.user = loggedUser;
      this.messageService.add({severity: 'success', summary:"Connecté"})
    }, error => {
      if (error.status == 403)
        this.messageService.add({severity: 'error', summary: "Nom d'utilisateur ou mot de passe invalide"});
      else
      {
        this.messageService.add({severity: 'error', summary: "Une erreur est survenue. Merci de réessayer"});
        console.log('Error : ' + JSON.stringify(error));
      }
    });
  }
}
