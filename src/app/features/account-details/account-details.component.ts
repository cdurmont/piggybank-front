import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import IAccount from "../../shared/models/IAccount";
import {AccountService} from "../../core/services/account.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {EntryService} from "../../core/services/entry.service";
import IEntry from "../../shared/models/IEntry";
import {TransactionService} from "../../core/services/transaction.service";
import {LoginService} from "../../core/services/login.service";
import IUser from "../../shared/models/IUser";
import {PermissionService} from "../../core/services/permission.service";
import ITransaction from "../../shared/models/ITransaction";
import {Entry} from "../../shared/business/Entry";

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  account: IAccount = {};
  subAccounts: IAccount[] = [];
  showSubAccounts: boolean = false;

  entries: IEntry[] = [];

  contextMenu: MenuItem[] = [];
  selectedEntry: IEntry = {};

  user:IUser = {};
  writeAllowed: boolean = false;
  showReconciled: boolean = false;
  selectAll:boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private entryService: EntryService,
              private transactionService: TransactionService,
              private messageService: MessageService,
              private confirmService: ConfirmationService,
              private loginService: LoginService,
              private permissionService: PermissionService,
              ) { }

  ngOnInit(): void {

    this.contextMenu = [
      {label: "Modifier", icon:'pi pi-fw pi-pencil', command: () => { this.updateEntry()}},
      {label: "Supprimer", icon:'pi pi-fw pi-trash', command: () => { this.deleteEntry()}},
    ];
    // main account
    this.route.params.subscribe(value => {
      let id = value.id;
      this.accountService.read({_id: id}).subscribe(
        value => {
          if (value && value.length == 1) {
            this.account = value[0];
            // entries
            this.loadEntries(id);
          }
        },
        error => { this.messageService.add({severity: 'error', summary: "Erreur de lecture du compte", data: error})}
      );

      // sub-accounts
      this.accountService.read({parent: {_id: id}}).subscribe(
        value => { this.subAccounts = value},
        error => { this.messageService.add({severity: 'error', summary: "Erreur de lecture des sous-comptes", data: error})}
      );


      // connected user
      this.loginService.getUser().subscribe(user => {
        this.user = user;
        if (user.admin)
          this.writeAllowed = true;
        else
          this.permissionService.read({user: user, account: { _id: id}}).subscribe(permissions => {
            if (permissions)
              permissions.forEach(permission => {
                if (permission.type === 'W')
                  this.writeAllowed = true;
              })
          })
      });
    });
  }

  loadEntries(accountId: string|null) {
    this.entryService.readDetailed({account: {_id: accountId}}, this.showReconciled || !this.account.reconcilable).subscribe(
      value => {
        //
        if (value)
          value.forEach(entry => {
            this.setCtpAccountName(entry);
          });
        this.entries = value;
      },
      error => { this.messageService.add({severity: 'error', summary: "Erreur de lecture des ??critures du compte", data: error})}
    );
  }

  private setCtpAccountName(entry: IEntry) {
    if (entry.contreparties && entry.contreparties.length > 1) {
      // step 1 : group by account
      let ctpRedux1: IEntry[] = [];
      let idAccounts: string[] = [];
      entry.contreparties.forEach(e => {
        let idx = idAccounts.indexOf(e.account._id);
        if (idx < 0) {  // if not present, add it to list
          idAccounts.push(e.account._id);
          ctpRedux1.push({...e}); // push a clone of e... later on we will modify it, so let's preserve the original
        } else {          // if present, merge debit/credit
          Entry.add(ctpRedux1[idx], e);
        }
      });
      // step 2 : remove "empty" lines
      let ctpRedux2: IEntry[] = [];
      ctpRedux1.forEach(e => {
        if (!Entry.isZero(e) || e.account._id === this.account._id) // always add the current account
          ctpRedux2.push(e);
      });
      // step 3 : set ctp account name
      if (ctpRedux2.length > 2)
        entry.contrepartieAccountName = "Transaction r??partie";
      else if (ctpRedux2.length == 2) {
        entry.contrepartieAccountName = ctpRedux2[0].account._id === this.account._id ? ctpRedux2[1].account.name : ctpRedux2[0].account.name;
      } else
        entry.contrepartieAccountName = "Transaction cheloue";
    }
  }

  toggleSubAccounts() {
    this.showSubAccounts = ! this.showSubAccounts;
  }

  private deleteEntry() {
    this.confirmService.confirm({
      icon: 'pi pi-exclamation-triangle',
      message: "Etes-vous s??r de vouloir supprimer l'ensemble de la transaction ?",
      accept: () => {
        this.transactionService.delete(this.selectedEntry.transaction).subscribe(
          () => {
          this.messageService.add({severity: 'success', summary: "Transaction supprim??e"});
          this.loadEntries(this.account._id);
        }, error => {
            this.messageService.add({severity: 'error', summary: "Erreur lors de la suppression de la transaction", data: error});
          })
      }
    })
  }

  private updateEntry() {
    this.router.navigate([`/transactions/update/${this.selectedEntry.transaction._id}/${this.account._id}`]).catch(() => {console.error('error navigating to transaction details')});
  }

  isSplitTransaction(transaction: ITransaction) {
    return (transaction && transaction.entries && transaction.entries.length>2);
  }

  toggleExpand(entry: IEntry) {
    entry.expanded = !entry.expanded;
  }

  isExpanded(entry:IEntry) {
    return entry.expanded == true;
  }

  openContextMenu(entry: IEntry) {
    this.selectedEntry = entry;

  }



  reconciledChanged() {
    this.loadEntries(this.account._id);
  }

  /**
   * "Select all" option for reconcilable accounts
   * @param evt evt.check = whether the "select all" checkbox is checked
   */
  onSelectAll(evt: any) {
    console.log("selectAll");
    this.entries.forEach(entry => {
      entry.transaction.selected = evt.checked;
    });
  }

  /**
   * Update all selected transactions, mark them as reconciled
   */
  markReconciled(mark:boolean) {
    this.entries.forEach(entry => {
      if (entry.transaction.selected) {
        console.log("mark txn "+entry.transaction.description +" : " + mark);
        entry.transaction.reconciled = mark;
        this.transactionService.update(entry.transaction).subscribe(()=>{}, error => {
          this.messageService.add({severity: 'error', summary: "Erreur modification de la transaction", data: error})
        });
      }
    });
    this.loadEntries(this.account._id);
  }

  /** reconcile 2 transactions
   * the selected transactions should balance out
   */
  reconcile() {
    let selectedEntries:IEntry[]=[];
    this.entries.forEach(entry => {
      if (entry.transaction.selected) {
        console.log("selected txn " + entry.transaction.description);
        selectedEntries.push(entry);
      }
    });

    if (selectedEntries.length != 2)
      this.messageService.add({severity: 'warn', summary: "S??lectionnez exactement 2 transactions ?? rapprocher"});
    else {
      if (Math.abs(Entry.creditDebit(selectedEntries[0]) + Entry.creditDebit(selectedEntries[1])) >= 0.01) {
        this.messageService.add({severity: 'warn', summary: "Les 2 transactions ?? rapprocher ne sont pas du m??me montant"});
      }
      else {
        // 1/ all entries on transaction 1 switch to transaction 0
        let remainingTxn = selectedEntries[0].transaction;
        let deleteTxn = selectedEntries[1].transaction
        this.entryService.batchUpdate(
          {transaction: {_id: deleteTxn._id}},
          {transaction: {_id: remainingTxn._id}}
          ).subscribe(() => {
            // 2/ transaction 0 marked as reconciled
            remainingTxn.reconciled = true;
            this.transactionService.update(remainingTxn).subscribe(
              () => {
                // 3/ transaction 1 gets deleted
                this.transactionService.delete(deleteTxn).subscribe(
                  () => {
                    // 4/ Finished!
                    this.messageService.add({severity: 'success', summary: "Transactions rapproch??es"});
                    this.entries.forEach(entry => {entry.transaction.selected = false});
                    this.loadEntries(this.account._id);
                  },
                  error => {
                    this.messageService.add({severity: 'error', summary: `La transaction ${deleteTxn._id} n'a pas pu ??tre supprim??e`, data: error})
                  }
                );
              },
              error => {
                this.messageService.add({severity: 'error', summary: `La transaction ${remainingTxn._id} n'a pas pu ??tre marqu??e comme rapproch??e`, data: error})
              }
            );

        }, error => {
          this.messageService.add({severity: 'error', summary: "Erreur modification de la transaction", data: error})
        });
      }
    }
  }

  creditDebit(entry: IEntry) {
    return Entry.creditDebit(entry);
  }
}
