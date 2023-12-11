import {Component, OnInit} from '@angular/core';
import { VersionService } from "./core/services/version.service";
import IUser from "./shared/models/IUser";
import {LoginService} from "./core/services/login.service";
import {MenuItem, MessageService} from "primeng/api";
import {AccountService} from "./core/services/account.service";
import {KeycloakService} from "keycloak-angular";
import Keycloak, {KeycloakProfile} from "keycloak-js";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  version = '';
  user: IUser | undefined;

  userMenuContent: MenuItem[] = [ {label: 'Mon Profil'},
                                  {label: 'Mes paramètres', routerLink: ['/preferences']},
                                  {label: 'Mes saisies rapides', routerLink: ['/quickInputs']},
                                  {label: 'Déconnexion', command: () => { this.logout() }}];

  mainMenuContent: MenuItem[] = [
    {label: 'Accueil', routerLink: ['/']},
    {label: 'Tous les comptes', routerLink: ['/allAccounts']},
    {label: 'Transactions récurrentes', routerLink: ['/transactions/recurring']},
    {label: 'Import', routerLink: ['/import']},
    {label: 'Synchro bancaire', routerLink: ['/import/connections']},
  ];

  loggedIn: boolean = false;
  userProfile: KeycloakProfile | null = null;
  profileUrl: string = '';
  maquette: boolean = false;

  constructor(private router: Router,
              private versionService: VersionService,
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
    let kc: Keycloak = this.keycloakService.getKeycloakInstance();
    this.profileUrl = `${kc.authServerUrl}/realms/${kc.realm}/account/`;
    this.userMenuContent[0].url = this.profileUrl;

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
