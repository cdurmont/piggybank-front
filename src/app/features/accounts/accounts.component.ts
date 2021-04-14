import { Component, OnInit } from '@angular/core';
import IAccount from "../../shared/models/IAccount";
import {AccountService} from "../../core/services/account.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public accounts:IAccount[] = [];

  constructor(private accountService: AccountService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.accountService.read({}).subscribe(value => {
      this.accounts = value;
    }, error => {
      this.messageService.add({severity: 'error', summary: "Erreur à la récupération des comptes", data: error});
      console.error('Error reading accounts : ' + JSON.stringify(error));
    })
  }

}
