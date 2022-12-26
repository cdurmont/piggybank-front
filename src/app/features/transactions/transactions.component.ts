import {Component, OnInit} from '@angular/core';
import ITransaction from "../../shared/models/ITransaction";
import IAccount from "../../shared/models/IAccount";
import IEntry from "../../shared/models/IEntry";
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../core/services/account.service";
import {MenuItem, MessageService} from "primeng/api";
import {Location} from "@angular/common";
import {TransactionService} from "../../core/services/transaction.service";
import {EntryService} from "../../core/services/entry.service";
import {LoginService} from "../../core/services/login.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  transMenuContent: MenuItem[] = [ {label: 'Inverser', command: () => { this.revertTransaction() }}];

  lastDate: Date = new Date();

  transaction: ITransaction = {
    entries: [
      {date: this.lastDate, account: {}},
      {date: this.lastDate, account: {}},
    ]
  };

  createMode: boolean = false;
  recurMode: boolean = false;
  quickMode: boolean = false;
  expanded: boolean = false;
  multi: boolean = false;
  mainAccount: IAccount = {};

  private deletedEntries: IEntry[] = [];

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private transactionService: TransactionService,
              private entryService: EntryService,
              private messageService: MessageService,
              private location: Location,
              private loginService: LoginService,
  ) {
  }

  private static addMonths(date: Date|undefined, months: number): Date|undefined {
    if (date) {
      let d = date.getDate();
      date.setMonth(date.getMonth() + +months);
      if (date.getDate() != d) {
        date.setDate(0);
      }
    }
    return date;
  }

  ngOnInit(): void {
    let path = this.route.snapshot.url[0].path;
    if (path === "create" || path === "createRecur" || path === "createQuick" || path === "useQuickInput")
      this.createMode = true;
    if (path === "createRecur")
      this.recurMode = true;
    if (path === "createQuick" || path === "useQuickInput")
      this.quickMode = true;
    let id = Number(this.route.snapshot.paramMap.get('id'));
    let mainAccountId = this.route.snapshot.paramMap.get('mainAccountId');
    if (id) {
      if (this.quickMode) {
        // id + quickMode => using a quick input as a model to create a new transaction
        this.multi = false;
        this.transaction.type = 'S';
        // TODO use transactionService
        this.entryService.read(1, {transaction: {id: id}}).subscribe(
          entries => {
            if (entries.length == 0)
              return this.messageService.add({severity: 'error', summary: "Impossible de lire la transaction: aucune écriture"});
            this.mainAccount = entries[0].account;
            this.transaction.entries = [];
            this.transaction.description = entries[0].transaction.description;
            // duplicates the model's entries
            entries.forEach(entry => {
              this.transaction.entries?.push({
                date: this.lastDate,
                account: entry.account,
                description: entry.description,
                debit: entry.debit,
                credit: entry.credit});
            });
          }, error => {
            this.messageService.add({severity: 'error', summary: "Impossible de lire la transaction", data: error});
            console.error(error);
          }
        );
      }
      else if (this.createMode) {
        this.accountService.read(1, {id: id}).subscribe(
          value => {
            this.mainAccount = value[0];
            this.initTransaction();
          }, () => {
            this.messageService.add({severity: 'warning', summary: "Impossible de récupérer le compte principal"});
          }
        );
      } else {
        // update mode, id is a Transaction id !
        this.transactionService.getById(1, id).subscribe(
          txn => {
            let entries: IEntry[] = txn.entries ? txn.entries : [];
            // init account and transaction, add 'entries' as member of transaction
            if (entries.length == 0)
              return this.messageService.add({severity: 'error', summary: "Impossible de lire la transaction: aucune écriture"});
            // put the main account's entry on top
            if (mainAccountId) {
              let mainEntryIndex:number= entries.findIndex(e => {return e.account.id == mainAccountId});
              if (mainEntryIndex >= 0) {
                let mainEntry:IEntry = entries[mainEntryIndex];
                entries.splice(mainEntryIndex, 1);
                entries.unshift(mainEntry);
              }
            }
            this.mainAccount = entries[0].account;
            this.transaction = txn;
            if (this.transaction.type === 'R') {
              this.recurMode = true;
              // sort by amount
              entries.sort((a, b) => {
                let result:number = 0;
                if (b.credit)
                  result+=b.credit;
                if (b.debit)
                  result+=b.debit;
                if (a.credit)
                  result-=a.credit;
                if (a.debit)
                  result-=a.debit;
                return result;
              });
            }

          }, error => {
            this.messageService.add({severity: 'error', summary: "Impossible de lire la transaction", data: error});
            console.error(error);
          }
        );
      }
    }
    else this.initTransaction();
  }

  initTransaction():void {
    this.transaction = {
      entries: [
        {date: this.lastDate, account: this.mainAccount ? this.mainAccount : {}},
        {date: this.lastDate, account: {}},
      ],
      type: this.quickMode ? 'Q' : this.recurMode ? 'R' : 'S'
    };
    if (this.quickMode) {
      this.multi = false;
      this.loginService.getUser().subscribe(user => {
        this.transaction.owner = user;
      });
    }
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

  changeDate(newDate: Date): void {
    this.lastDate = newDate;
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
      if (entry.account && entry.account.id) {   // ignore "empty" lines
        if (entry.debit) totalDebit += entry.debit;
        if (entry.credit) totalCredit += entry.credit;
      }
    });
    console.log("handleExtraLines : totaux : "+totalDebit+"/"+totalCredit);
    // step 2, if transaction is unbalanced, find an "empty" line and balance it, create an empty line if needed

    // find an empty line. Let's say an empty line is when no account is selected (yeah, why not)
    let emptyLines: IEntry[] | undefined = this.transaction.entries?.filter(entry => {
      return (!entry.account || !entry.account.id)
    });
    console.log("handleExtraLines : empty lines : "+JSON.stringify(emptyLines));
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
      let keep = entry.debit || entry.credit; // false if both credit and debit are undefined, false or whatever js considers equivalent
      if (!keep && entry.id)
        this.deletedEntries.push(entry);      // put it aside so we can delete it when saving the transaction
      return keep;
    })
  }

  cancel(): void {
    this.location.back();
  }

  save(): void {

    if (!this.validate())
      return;
    if (this.recurMode) {
      if (!this.transaction.recurNextDate) {
        this.transaction.recurNextDate = TransactionsComponent.addMonths(this.transaction.recurStartDate, 1);
      }
      else if (this.transaction.recurEndDate && this.transaction.recurEndDate.getTime() < this.transaction.recurNextDate.getTime())
        this.transaction.recurNextDate = undefined;

      if (this.transaction.recurNextDate && this.transaction.recurStartDate && this.transaction.recurNextDate.getTime() < this.transaction.recurStartDate.getTime())
        this.transaction.recurNextDate = this.transaction.recurStartDate;
    }


    if (this.createMode)
      this.saveCreate();
     else
      this.saveUpdate();


  }

  isSplitTransaction(): boolean {
    return !this.transaction.entries ? false : (this.transaction.entries.length > 2);
  }

  private saveUpdate() {
    this.transactionService.update(1, this.transaction).subscribe(
      () => {
        this.messageService.add({severity: 'success', summary: "Transaction enregistrée"});
        this.location.back();
      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: "Erreur à l'enregistrement de la transaction",
          detail: "Vérifiez la transaction, elle est peut-être corrompue!",
          data: error
        });
        this.location.back();
      }
    );
    /*
    let ok: boolean = true;
    // updating the transaction it tricky ! Might be some entries to create, update and/or delete !
    this.deletedEntries.forEach(entry => {
      this.entryService.delete(1, entry).subscribe(
        () => {
        },
        (error: any) => {
          ok = false;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur à l'enregistrement de la transaction (1)",
            detail: "Aucune modification appliquée",
            data: error
          });
        }
      );
    });
    // @ts-ignore
    let entries: IEntry[] = this.transaction.entries;
    this.transaction.entries = undefined; // or things get messy when serializing... objects are nested
    let newEntries: IEntry[] = entries.filter(entry => {
      return entry.id == undefined
    });
    newEntries?.forEach(entry => {
      entry.transaction = this.transaction;
      this.entryService.create(1, entry).subscribe(
        () => {
        }, error => {
          ok = false;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur à l'enregistrement de la transaction (2)",
            detail: "Vérifiez la transaction, elle est peut-être corrompue!",
            data: error
          });
        }
      );
    });
    let updatedEntries: IEntry[] = entries.filter(entry => {
      return entry.id != undefined
    });
    updatedEntries?.forEach(entry => {
      this.entryService.update(1, entry).subscribe(
        () => {
        }, error => {
          ok = false;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur à l'enregistrement de la transaction (3)",
            detail: "Vérifiez la transaction, elle est peut-être corrompue!",
            data: error
          });
        }
      );
    });
    if (ok) {
      this.transactionService.update(1, this.transaction).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: "Transaction enregistrée"});
          this.location.back();
        }, error => {
          this.messageService.add({
            severity: 'error',
            summary: "Erreur à l'enregistrement de la transaction (4)",
            detail: "Vérifiez la transaction, elle est peut-être corrompue!",
            data: error
          });
          this.location.back();
        }
      );
    } else this.transaction.entries = entries;
     */
  }

  private saveCreate() {
    this.transactionService.create(1, this.transaction).subscribe(
      () => {
        // @ts-ignore
        const entries:IEntry[] = [...this.transaction.entries];
        this.transaction.entries = undefined;
        // @ts-ignore
        entries.forEach(entry => {
          entry.transaction = this.transaction;
          console.log("Enregistrement écriture : "+ JSON.stringify(entry));
          this.entryService.create(1, entry).subscribe(
            () => {
            }, error => {
              this.messageService.add({
                severity: 'error',
                summary: "Erreur à l'enregistrement de la transaction (2)",
                detail: "Vérifiez la transaction, elle est peut-être corrompue!",
                data: error
              });
              console.log(JSON.stringify(error));
            }
          );
        });
        this.messageService.add({severity: 'success', summary: "Transaction enregistrée"});
        if (!this.multi)
          this.location.back();
        this.initTransaction();
      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: "Erreur à l'enregistrement de la transaction",
          data: error
        });
        console.error(error);
      }
    );
  }

  private validate() {
    let ok: boolean = true;
    // @ts-ignore
    this.transaction.entries.forEach((entry, pos) => {
      if (!entry.account || !entry.account.id) {
        ok = false;
        this.messageService.add({
          severity: 'warn',
          summary: "Saisie incomplète",
          detail: (1 + pos) + "e ligne: pas de compte sélectionné"
        });
      }
    });
    if (this.recurMode && !this.transaction.recurStartDate) {
      this.messageService.add({severity: 'warn', summary: "La date de première exécution est obligatoire"});
      ok = false;
    }
    return ok;
  }

  private revertTransaction() {
    this.transaction.entries?.forEach(entry => {
      let oldDebit = entry.debit;
      entry.debit = entry.credit;
      entry.credit = oldDebit;
    })
  }

  debitStyleClass(entry: IEntry) {
    let good:boolean = true;
    if (!entry.debit)
      return "";
    if (entry.account.colorRevert)
      good = !good;
    return good ? "good" : "bad";
  }
}
