import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../core/services/account.service";
import {MessageService} from "primeng/api";
import {TreeNode} from 'primeng/api';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public accounts:TreeNode[] = [];

  constructor(protected accountService: AccountService,
              protected messageService: MessageService) { }

  ngOnInit(): void {
    this.accountService.read({parent: {}}).subscribe(value => {
      this.accounts = value.map<TreeNode>(account => {
        let tn:TreeNode = {data: account, leaf: false, label: account.name, key: account._id};
        return tn;
      });

    }, error => {
      this.messageService.add({severity: 'error', summary: "Erreur à la récupération des comptes", data: error});
      console.error('Error reading accounts : ' + JSON.stringify(error));
    })
  }

  onNodeExpand(event: {node:TreeNode}) {
    const node = event.node;
    this.accountService.read({parent: {_id : node.data._id}}).subscribe(subAccounts => {

      if (!subAccounts || subAccounts.length == 0)
        node.leaf = true;
      else {
        event.node.children = subAccounts.map<TreeNode>(account => {
          let tn:TreeNode = {data: account, leaf: false, label: account.name, key: account._id};
          return tn;
        });
      }

      this.accounts = [...this.accounts]; // needed to refresh the table

    }, error => {
      this.messageService.add({severity: 'error', summary: "Erreur à la récupération des comptes", data: error});
      console.error('Error reading accounts : ' + JSON.stringify(error));
    })
  }

}
