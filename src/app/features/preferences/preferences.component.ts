import { Component, OnInit } from '@angular/core';
import IUser from "../../shared/models/IUser";
import {LoginService} from "../../core/services/login.service";
import {MessageService} from "primeng/api";
import {UserService} from "../../core/services/user.service";

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  user:IUser = {};

  constructor(private loginService: LoginService,
              private userService: UserService,
              private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.loginService.getUser().subscribe(value => { this.user = {...value}});
  }

  save(): void {
    if (this.user.hash && this.user.hash.length == 0)
      delete this.user.hash;  // remove password if empty

    this.userService.update(this.user).subscribe(() => {
        this.messageService.add({severity: 'success', summary: 'Paramètres enregistrés'});
      },
      error => {
        this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement des paramètres", data: error});
      })

  }
}
