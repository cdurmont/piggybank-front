import { Component, OnInit } from '@angular/core';
import IUser from "../../shared/models/IUser";
import {LoginService} from "../../core/services/login.service";
import {MessageService} from "primeng/api";
import {UserService} from "../../core/services/user.service";
import {PaymentMethodService} from "../../core/services/payment-method.service";
import IPaymentMethod from "../../shared/models/IPaymentMethod";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  paymentMethods: IPaymentMethod[] = [];

  constructor(private paymentMethodService: PaymentMethodService,
              private keycloakService: KeycloakService,
              private userService: UserService,
              private messageService: MessageService) {

  }

  async ngOnInit() {
    const loggedIn: boolean = await this.keycloakService.isLoggedIn();
    if (loggedIn) {
      const userProfile = await this.keycloakService.loadUserProfile();

      this.userService.read({login: userProfile.username}).subscribe(users => {
        if (users && users.length == 1) {
          const user = users[0];
          this.paymentMethodService.read(1, {user: user})
            .subscribe(pmList => {
              this.paymentMethods = pmList;
            }, error => {
              this.messageService.add({severity: 'error', summary: "Erreur à la récupération des moyens de paiement", data: error});
              console.error('Error reading payment methods : ' + JSON.stringify(error));
            });

        } else {
          console.error("users found : " + JSON.stringify(users));
        }
      });

    }
  }

  savePM(): void {
    this.messageService.add({severity: 'error', summary: "Non implémenté"});

  }
}
