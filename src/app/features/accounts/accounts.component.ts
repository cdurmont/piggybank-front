import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../core/services/account.service";
import {MenuItem, MessageService} from "primeng/api";
import {TreeNode} from 'primeng/api';
import {TransactionService} from "../../core/services/transaction.service";
import {LoginService} from "../../core/services/login.service";
import IUser from "../../shared/models/IUser";
import IAccount from "../../shared/models/IAccount";
import {UserService} from "../../core/services/user.service";
import {KeycloakProfile} from "keycloak-js";
import {KeycloakService} from "keycloak-angular";


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public accounts:TreeNode[]=[];
  public quickInputsMenu: MenuItem[] = [];
  public user:IUser= {};
  public userProfile: KeycloakProfile | null = null;

  constructor(protected accountService: AccountService,
              protected messageService: MessageService,
              protected transactionService: TransactionService,
              protected userService: UserService,
              private readonly keycloakService: KeycloakService
              ) { }

  async ngOnInit() {
    this.accountService.readTree(1).subscribe(value => {
      this.accounts = value
        .filter(account => {
          return (account.type != 'I')
        })
        .map<TreeNode>(account => {
          let tn: TreeNode = {data: account, leaf: account.subAccounts == null, label: account.name, key: account.id};
          return tn;
        });

    }, error => {
      this.messageService.add({severity: 'error', summary: "Erreur à la récupération des comptes", data: error});
      console.error('Error reading accounts : ' + JSON.stringify(error));
    });
    // quick inputs
    const loggedIn: boolean = await this.keycloakService.isLoggedIn();
    if (loggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();

      this.userService.read({login: this.userProfile.username}).subscribe(users => {
        if (users && users.length == 1) {
          this.user = users[0];
          this.transactionService.read(1, {type: 'Q', owner: {id: this.user.id}}).subscribe(txns => {
            if (txns)
              txns.forEach(txn => {
                this.quickInputsMenu.push({
                  label: txn.description,
                  routerLink: '/transactions/useQuickInput/' + txn.id
                });
              });
          })

        }
        else {
          console.error("users found : " + JSON.stringify(users));
        }
      });
    }
  }

  onNodeExpand(event: {node:TreeNode}) {
    const node = event.node;
    if (!node.children) {
      const subs:Array<IAccount> = node.data.subAccounts;
      node.children = subs.map<TreeNode>(account => {
        let tn:TreeNode = {data: account, leaf:account.subAccounts == null, label: account.name, key: account.id};
        return tn;
      });
    }
  }


}
