import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../core/services/account.service";
import IAccount from "../../shared/models/IAccount";
import {MessageService} from "primeng/api";
import IStat from "../../shared/models/IStat";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  expenseAccounts: IAccount[] = [];
  assetAccounts: IAccount[] = [];

  constructor(private accountService: AccountService,
              private messageService: MessageService,
              ) { }

  ngOnInit(): void {

    this.accountService.read(1, {parent: {id: 15}}).subscribe(
      value => {
        this.expenseAccounts = value;
        this.loadStats(value);
      },
      error => {
        this.messageService.add({severity: 'error', summary: "Erreur de lecture des comptes de dépense", data: error})
      }
    );
    this.accountService.read(1, {parent: {id: 41}}).subscribe(
      value => {
        this.assetAccounts = value;
        this.loadStats(value);
      },
      error => {
        this.messageService.add({severity: 'error', summary: "Erreur de lecture des comptes d'actifs", data: error})
      }
    );


  }

  loadStats(value: IAccount[]) {
    if (value)
      value.forEach(account => {
        this.accountService.getStats(1, {id:account.id}).subscribe(
          stats => {
            account.stats = stats;
          },
          error => {
            this.messageService.add({severity: 'error', summary: "Erreur de lecture des stats compte "+account.id, data: error})
          }
        );
      })
  }

  currentStats(account: IAccount) : IStat {
    let statNow:IStat = {};
    let now:Date = new Date();
    if (account && account.stats)
      account.stats.forEach(stat => {
        if (stat.year == now.getFullYear() && stat.month == now.getMonth()+1)
          statNow = stat;
      });
    if (!statNow.credit)
      statNow.credit = 0;
    if (!statNow.debit)
      statNow.debit = 0;

    return statNow;
  }

}
