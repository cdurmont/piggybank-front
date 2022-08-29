import {Component, OnInit} from '@angular/core';
import { VersionService } from "./core/services/version.service";
import IUser from "./shared/models/IUser";
import {LoginService} from "./core/services/login.service";
import {MenuItem, MessageService} from "primeng/api";
import {AccountService} from "./core/services/account.service";
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";

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

  loggedIn: boolean = false;
  userProfile: KeycloakProfile | null = null;



  constructor(private versionService: VersionService,
              private accountService: AccountService,
              private loginService: LoginService,
              private readonly keycloakService: KeycloakService) {
  }

  async ngOnInit() {
    this.loginService.getUser().subscribe(value => {
      this.user = value
    });
    this.versionService.getVersion().subscribe(value => {
      this.version = value.version
    });

    this.loggedIn = await this.keycloakService.isLoggedIn();

    if (this.loggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
    }
  }

  logout(): void {
    this.user = undefined;
  }
  refresh(): void {
    this.accountService.forceReload();
  }
}
