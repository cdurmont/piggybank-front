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

  TOLERANCE_PERCENT: number = 10;

  expenseAccounts: IAccount[] = [];
  assetAccounts: IAccount[] = [];
  showMonth: number = -1;

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
    let now:Date = new Date();
    now.setMonth(now.getMonth() + this.showMonth,1);  // show current/previous/any month

    return this.statOfDate(account, now);
  }

  statOfDate(account: IAccount, statDate: Date) : IStat {
    let statNow:IStat = {};
    if (account && account.stats)
      account.stats.forEach(stat => {
        if (stat.year == statDate.getFullYear() && stat.month == statDate.getMonth()+1)
          statNow = stat;
      });
    if (!statNow.credit)
      statNow.credit = 0;
    if (!statNow.debit)
      statNow.debit = 0;
    return statNow;
  }

  tendency(account: IAccount) : string {
    let retour: string = '-';
    const current: IStat = this.currentStats(account);
    let previousMonth:Date = new Date();
    previousMonth.setMonth(previousMonth.getMonth() + this.showMonth -1,1 );
    const previous: IStat = this.statOfDate(account, previousMonth);
    // @ts-ignore
    const currentBalance:number = current.credit - current.debit;
    // @ts-ignore
    const previousBalance:number = previous.credit - previous.debit;
    const tolerance:number = Math.abs(previousBalance * this.TOLERANCE_PERCENT / 100) ;
    if (currentBalance > previousBalance + tolerance)
      retour = '^';
    if (currentBalance < previousBalance - tolerance)
      retour = 'v';
    //console.log(`compte ${account.name} balance m:${currentBalance}, balance m-1:${previousBalance}, tolerance:${tolerance}, tendance:${retour}`);
    return retour;
  }
}
