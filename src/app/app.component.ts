import {Component, OnInit} from '@angular/core';
import { VersionService } from "./core/services/version.service";
import IUser from "./shared/models/IUser";
import {LoginService} from "./core/services/login.service";
import {MenuItem, MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  version = '';
  user: IUser | undefined;

  userMenuContent: MenuItem[] = [ {label: 'Préférences', routerLink: ['/preferences']},
                                  {label: 'Déconnexion', command: () => { this.logout() }}];

  mainMenuContent: MenuItem[] = [ {label: 'Comptes', routerLink: ['/']}];

  constructor(private versionService: VersionService,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.getUser().subscribe(value => { this.user = value});
    this.versionService.getVersion().subscribe(value => { this.version = value.version });
  }

  logout(): void {
    this.user = undefined;
  }
}
