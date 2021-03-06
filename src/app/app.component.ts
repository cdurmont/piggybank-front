import {Component, OnInit} from '@angular/core';
import { VersionService } from "./core/services/version.service";
import IUser from "./shared/models/IUser";
import {LoginService} from "./core/services/login.service";
import {MenuItem, MessageService} from "primeng/api";
import {AccountService} from "./core/services/account.service";

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
                                  {label: 'Mes saisies rapides', routerLink: ['/quickInputs']},
                                  {label: 'Déconnexion', command: () => { this.logout() }}];

  mainMenuContent: MenuItem[] = [
    {label: 'Comptes', routerLink: ['/']},
    {label: 'Transactions récurrentes', routerLink: ['/transactions/recurring']},
    {label: 'Import OFX', routerLink: ['/import']},
  ];

  constructor(private versionService: VersionService,
              private accountService: AccountService,
              private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.getUser().subscribe(value => { this.user = value});
    this.versionService.getVersion().subscribe(value => { this.version = value.version });
  }

  logout(): void {
    this.user = undefined;
  }
  refresh(): void {
    this.accountService.forceReload();
  }
}
