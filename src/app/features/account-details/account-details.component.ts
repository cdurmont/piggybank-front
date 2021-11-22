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
        value => { if (value && value.length == 1) this.account = value[0]},
        error => { this.messageService.add({severity: 'error', summary: "Erreur de lecture du compte", data: error})}
      );

      // sub-accounts
      this.accountService.read({parent: {_id: id}}).subscribe(
        value => { this.subAccounts = value},
        error => { this.messageService.add({severity: 'error', summary: "Erreur de lecture des sous-comptes", data: error})}
      );

      // entries
      this.loadEntries(id);

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
    this.entryService.readDetailed({account: {_id: accountId}}).subscribe(
      value => {
        //
        if (value)
          value.forEach(entry => {
            if (entry.contreparties && entry.contreparties.length>1)
              while (entry.contreparties[0].account._id == this.account._id)
                entry.contreparties.push(<IEntry>entry.contreparties.shift());
          });
        this.entries = value;
      },
      error => { this.messageService.add({severity: 'error', summary: "Erreur de lecture des écritures du compte", data: error})}
    );
  }

  toggleSubAccounts() {
    this.showSubAccounts = ! this.showSubAccounts;
  }

  private deleteEntry() {
    this.confirmService.confirm({
      icon: 'pi pi-exclamation-triangle',
      message: "Etes-vous sûr de vouloir supprimer l'ensemble de la transaction ?",
      accept: () => {
        this.transactionService.delete(this.selectedEntry.transaction).subscribe(
          () => {
          this.messageService.add({severity: 'success', summary: "Transaction supprimée"});
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

  creditDebit(entry: IEntry) {
    let credit:number = 0;
    let debit:number = 0;
    if (entry.credit)
      credit = entry.credit;
    if (entry.debit)
      debit = entry.debit;
    return debit - credit;

  }
}
