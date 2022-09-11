import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../core/services/account.service";
import {MenuItem, MessageService} from "primeng/api";
import {TreeNode} from 'primeng/api';
import {TransactionService} from "../../core/services/transaction.service";
import {LoginService} from "../../core/services/login.service";
import IUser from "../../shared/models/IUser";
import IAccount from "../../shared/models/IAccount";


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public accounts:TreeNode[]=[];
  public quickInputsMenu: MenuItem[] = [];
  public user:IUser= {};

  constructor(protected accountService: AccountService,
              protected messageService: MessageService,
              protected transactionService: TransactionService,
              protected loginService: LoginService,
              ) { }

  ngOnInit(): void {
    this.accountService.readTree(1).subscribe(value => {
      this.accounts = value
        .filter(account => {
          return (account.type != 'I')
        })
        .map<TreeNode>(account => {
          let tn:TreeNode = {data: account, leaf: account.subAccounts == null, label: account.name, key: account.id};
          return tn;
        });

    }, error => {
      this.messageService.add({severity: 'error', summary: "Erreur à la récupération des comptes", data: error});
      console.error('Error reading accounts : ' + JSON.stringify(error));
    });
    // quick inputs
    this.loginService.getUser().subscribe(user => {
      this.user = user;
      this.transactionService.read({type: 'Q', owner: { id: user.id}}).subscribe( txns => {
        if (txns)
          txns.forEach(txn => {
            this.quickInputsMenu.push({label: txn.description, routerLink: '/transactions/useQuickInput/'+txn._id});
          });
      })
    });
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
    // @ts-ignore
    // if (node.key && !node.loaded)
    //   this.accountService.read(1, {parent: {_id: node.data._id}}).subscribe(subAccounts => {
    //
    //     if (!subAccounts || subAccounts.length == 0)
    //       node.leaf = true;
    //     else {
    //       event.node.children = subAccounts.map<TreeNode>(account => {
    //         let tn:TreeNode = {data: account, leaf: false, label: account.name, key: account.id};
    //         return tn;
    //       });
    //       // this.accountService.updateCache(this.accounts);
    //     }
    //
    //     this.accounts = [...this.accounts]; // needed to refresh the table
    //     // @ts-ignore
    //     node.loaded = true;
    //   }, error => {
    //     this.messageService.add({severity: 'error', summary: "Erreur à la récupération des comptes", data: error});
    //     console.error('Error reading accounts : ' + JSON.stringify(error));
    //   })
  }


}
