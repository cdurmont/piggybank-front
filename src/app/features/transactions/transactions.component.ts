import {Component, OnInit} from '@angular/core';
import ITransaction from "../../shared/models/ITransaction";
import IAccount from "../../shared/models/IAccount";
import IEntry from "../../shared/models/IEntry";
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../core/services/account.service";
import {MessageService} from "primeng/api";
import {Location} from "@angular/common";
import {TransactionService} from "../../core/services/transaction.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {


  transaction: ITransaction = {
    entries: [
      {date: new Date(), account: {}},
      {date: new Date(), account: {}},
    ]
  };

  expanded: boolean = false;
  multi: boolean = true;
  mainAccount: IAccount = {}

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private transactionService: TransactionService,
              private messageService: MessageService,
              private location: Location,
  ) {
  }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accountService.read({_id: id}).subscribe(
        value => {
          this.mainAccount = value[0];
          this.initTransaction();
        }, () => {
          this.messageService.add({severity: 'warning', summary: "Impossible de récupérer le compte principal"})
        }
      );
    }
  }

  initTransaction():void {
    this.transaction = {
      entries: [
        {date: new Date(), account: this.mainAccount ? this.mainAccount : {}},
        {date: new Date(), account: {}},
      ]
    };
  }
  setAccount(account: IAccount, entry: IEntry): void {
    entry.account = account;
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  changeMainDebit(newDebit: number): void {
    if (this.transaction.entries && this.transaction.entries.length > 0) {
      // écriture principale
      this.transaction.entries[0].debit = newDebit;
      this.transaction.entries[0].credit = undefined;
      // contrepartie
      this.transaction.entries[1].debit = undefined;
      this.transaction.entries[1].credit = newDebit;
    }
  }

  changeMainCredit(newCredit: number): void {
    if (this.transaction.entries && this.transaction.entries.length > 0) {
      // écriture principale
      this.transaction.entries[0].debit = undefined;
      this.transaction.entries[0].credit = newCredit;
      // contrepartie
      this.transaction.entries[1].debit = newCredit;
      this.transaction.entries[1].credit = undefined;
    }
  }


  changeDebit(newDebit: number, entry: IEntry): void {
    entry.debit = newDebit;
    entry.credit = undefined;
    this.handleExtraLines();
  }

  changeCredit(newCredit: number, entry: IEntry): void {
    entry.debit = undefined;
    entry.credit = newCredit;
    this.handleExtraLines();
  }

  handleExtraLines(): void {
    // step 1, calculate balance
    let totalDebit: number = 0, totalCredit: number = 0;
    this.transaction.entries?.forEach(entry => {
      if (entry.account && entry.account._id) {   // ignore "empty" lines
        if (entry.debit) totalDebit += entry.debit;
        if (entry.credit) totalCredit += entry.credit;
      }
    });
    // step 2, if transaction is unbalanced, find an "empty" line and balance it, create an empty line if needed

    // find an empty line. Let's say an empty line is when no account is selected (yeah, why not)
    let emptyLines: IEntry[] | undefined = this.transaction.entries?.filter(entry => {
      return (!entry.account || !entry.account._id)
    });
    if (!emptyLines || emptyLines.length == 0) {
      // no empty line ? Create one
      let empty: IEntry = {date: new Date(), account: {}};
      this.transaction.entries?.push(empty);
      if (!emptyLines) emptyLines = [];
      emptyLines.push(empty);
    }
    // use empty line to balance transaction
    let empty: IEntry = emptyLines[0];
    let delta: number = totalDebit - totalCredit;
    if (delta > 0) { // debit
      empty.debit = undefined;
      empty.credit = delta;
    } else if (delta < 0) {
      empty.debit = -delta;
      empty.credit = undefined;
    } else {
      empty.debit = undefined;
      empty.credit = undefined;
    }

    // step 3, remove unneeded line(s)
    this.transaction.entries = this.transaction.entries?.filter(entry => {
      return (entry.debit || entry.credit);   // false if both credit and debit are undefined, false or whatever js considers equivalent
    })
  }

  cancel(): void {
    this.location.back();
  }

  save(): void {
    let ok:boolean = true;
    this.transaction.entries?.forEach((entry, pos) => {
      if (!entry.account || !entry.account._id) {
        ok =false;
        this.messageService.add({severity:'warn', summary: "Saisie incomplète", detail: (1+pos) + "e ligne: pas de compte sélectionné"})
      }
    })
    if (!ok)
      return;

    this.transactionService.create(this.transaction).subscribe(
      value => {
        this.messageService.add({severity:'success', summary: "Transaction enregistrée"});
        if (!this.multi)
          this.location.back();
        this.initTransaction();
      }, error => {
        this.messageService.add({severity:'error', summary: "Erreur à l'enregistrement de la transaction", data: error});
        console.error(error);
      }
    );
  }

  isSplitTransaction(): boolean {
    return !this.transaction.entries ? false : (this.transaction.entries.length > 2);
  }
}
