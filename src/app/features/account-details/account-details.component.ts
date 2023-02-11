import {Component, OnInit, ViewChild} from '@angular/core';
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
import {KeycloakService} from "keycloak-angular";
import {UserService} from "../../core/services/user.service";
import {Menu} from "primeng/menu";

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {

  PAGE_SIZE: number = 100;

  account: IAccount = {};
  subAccounts: IAccount[] = [];
  showSubAccounts: boolean = false;

  entries: IEntry[] = [];

  contextMenu: MenuItem[] = [];
  selectedEntry: IEntry = {};

  user: IUser = {};

  nbLinesQueried: number = 0;
  pageNumber: number = 0;
  writeAllowed: boolean = false;
  showReconciled: boolean = false;
  selectAll: boolean = false;
  accountMenu: MenuItem[] = [];
  @ViewChild('menu', {static: false}) menu: Menu | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private entryService: EntryService,
              private transactionService: TransactionService,
              private messageService: MessageService,
              private confirmService: ConfirmationService,
              private userService: UserService,
              private permissionService: PermissionService,
              private keycloakService: KeycloakService
  ) {
  }

  async ngOnInit() {

    this.contextMenu = [
      {
        label: "Modifier", icon: 'pi pi-fw pi-pencil', command: () => {
          this.updateEntry()
        }
      },
      {
        label: "Supprimer", icon: 'pi pi-fw pi-trash', command: () => {
          this.deleteEntry()
        }
      },
    ];
    // main account
    this.route.params.subscribe(async value => {
      let id = value.id;
      this.accountService.read(1, {id: id}).subscribe(
        value => {
          if (value && value.length == 1) {
            this.account = value[0];
            // entries
            this.loadEntries(id, 0);
          }
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur de lecture du compte", data: error})
        }
      );

      // sub-accounts
      this.accountService.read(1, {parent: {id: id}}).subscribe(
        value => {
          this.subAccounts = value;
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur de lecture des sous-comptes", data: error})
        }
      );


      // connected user
      await this.keycloakService.loadUserProfile();
      this.userService.read({login: this.keycloakService.getUsername()}).subscribe(users => {
        if (users && users.length == 1) {
          this.user = users[0];
          if (this.keycloakService.isUserInRole("admin"))
            this.writeAllowed = true;
          else
            this.permissionService.read(1, {user: this.user, account: {id: id}}).subscribe(permissions => {
              if (permissions)
                permissions.forEach(permission => {
                  if (permission.type === 'W')
                    this.writeAllowed = true;
                })
            })
        }
      });
    });
  }

  loadEntries(accountId: string | null, page: number) {
    this.accountService.readEntries(1, accountId, this.showReconciled || !this.account.reconcilable, page, this.PAGE_SIZE).subscribe(
      value => {
        if (value)
          value.forEach(entry => {
            this.setCtpAccountName(entry);
          });
        if (page == 0) { // first page, initialize list
          this.entries = value.reverse(); // the service returns entries ordered by date desc, but we want the most recent at the bottom, and load older entries from the top
          this.pageNumber = 1;
          this.nbLinesQueried = this.PAGE_SIZE;
        } else {
          this.entries = value.reverse().concat(this.entries);  // if this is an additional page, merge the new entries with the existing ones
          this.pageNumber++;
          this.nbLinesQueried += this.PAGE_SIZE;
        }
      },
      error => {
        this.messageService.add({severity: 'error', summary: "Erreur de lecture des écritures du compte", data: error})
      }
    );
  }

  private setCtpAccountName(entry: IEntry) {
    if (entry.transaction && entry.transaction.entries && entry.transaction.entries.length > 0) {
      // step 1 : group by account
      let ctpRedux1: IEntry[] = [];
      let idAccounts: string[] = [];
      entry.transaction.entries.forEach((e: IEntry) => {
        let idx = idAccounts.indexOf(e.account.id);
        if (idx < 0) {  // if not present, add it to list
          idAccounts.push(e.account.id);
          ctpRedux1.push({...e}); // push a clone of e... later on we will modify it, so let's preserve the original
        } else {          // if present, merge debit/credit
          Entry.add(ctpRedux1[idx], e);
        }
      });
      // step 2 : remove "empty" lines
      let ctpRedux2: IEntry[] = [];
      ctpRedux1.forEach(e => {
        if (!Entry.isZero(e)) // TODO current account used to be in the list... see if we need to add it manually now //|| e.account.id === this.account.id
          ctpRedux2.push(e);
      });
      // step 3 : set ctp account name
      if (ctpRedux2.length > 1)
        entry.contrepartieAccountName = "Transaction répartie";
      else if (ctpRedux2.length == 1) {
        entry.contrepartieAccountName = ctpRedux2[0].account.name;
      } else
        entry.contrepartieAccountName = "Transaction cheloue";
    }
  }

  toggleSubAccounts() {
    this.showSubAccounts = !this.showSubAccounts;
  }

  private deleteEntry() {
    this.confirmService.confirm({
      icon: 'pi pi-exclamation-triangle',
      message: "Etes-vous sûr de vouloir supprimer l'ensemble de la transaction ?",
      accept: () => {
        this.transactionService.delete(1, this.selectedEntry.transaction).subscribe(
          () => {
            this.messageService.add({severity: 'success', summary: "Transaction supprimée"});
            this.loadEntries(this.account.id, 0);
          }, error => {
            this.messageService.add({
              severity: 'error',
              summary: "Erreur lors de la suppression de la transaction",
              data: error
            });
          })
      }
    })
  }

  private updateEntry() {
    this.router.navigate([`/transactions/update/${this.selectedEntry.transaction.id}/${this.account.id}`]).catch(() => {
      console.error('error navigating to transaction details')
    });
  }

  isSplitTransaction(transaction: ITransaction) {
    return (transaction && transaction.entries && transaction.entries.length > 1);
  }

  toggleExpand(entry: IEntry) {
    entry.expanded = !entry.expanded;
  }

  isExpanded(entry: IEntry) {
    return entry.expanded == true;
  }

  openContextMenu(entry: IEntry) {
    this.selectedEntry = entry;

  }


  reconciledChanged() {
    this.loadEntries(this.account.id, 0);
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
  markReconciled(mark: boolean) {
    this.entries.forEach(entry => {
      if (entry.transaction.selected) {
        console.log("mark txn " + entry.transaction.description + " : " + mark);
        entry.transaction.reconciled = mark;
        this.transactionService.update(1, entry.transaction).subscribe(() => {
        }, error => {
          this.messageService.add({severity: 'error', summary: "Erreur modification de la transaction", data: error})
        });
      }
    });
    this.loadEntries(this.account.id, 0);
  }

  /** reconcile 2 transactions
   * the selected transactions should balance out
   */
  reconcile() {
    let selectedEntries: IEntry[] = [];
    this.entries.forEach(entry => {
      if (entry.transaction.selected) {
        console.log("selected txn " + entry.transaction.description);
        selectedEntries.push(entry);
      }
    });

    if (selectedEntries.length != 2)
      this.messageService.add({severity: 'warn', summary: "Sélectionnez exactement 2 transactions à rapprocher"});
    else {
      if (Math.abs(Entry.creditDebit(selectedEntries[0]) + Entry.creditDebit(selectedEntries[1])) >= 0.01) {
        this.messageService.add({
          severity: 'warn',
          summary: "Les 2 transactions à rapprocher ne sont pas du même montant"
        });
      } else {
        // 1/ all entries on transaction 1 switch to transaction 0
        let remainingTxn = selectedEntries[0].transaction;
        let deleteTxn = selectedEntries[1].transaction;
        this.entryService.batchUpdate(1, {transaction: {id: deleteTxn.id}}, {transaction: {id: remainingTxn.id}}).subscribe(() => {
          // 2/ transaction 0 marked as reconciled
          remainingTxn.reconciled = true;
          this.transactionService.update(1, remainingTxn).subscribe(
            () => {
              // 3/ transaction 1 gets deleted
              this.transactionService.delete(1, deleteTxn).subscribe(
                () => {
                  // 4/ Finished!
                  this.messageService.add({severity: 'success', summary: "Transactions rapprochées"});
                  this.entries.forEach(entry => {
                    entry.transaction.selected = false
                  });
                  this.loadEntries(this.account.id, 0);
                },
                error => {
                  this.messageService.add({
                    severity: 'error',
                    summary: `La transaction ${deleteTxn.id} n'a pas pu être supprimée`,
                    data: error
                  })
                }
              );
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: `La transaction ${remainingTxn.id} n'a pas pu être marquée comme rapprochée`,
                data: error
              })
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

  showMoreLines(): boolean {
    return this.nbLinesQueried <= this.entries.length;
  }

  loadMoreLines() {
    this.loadEntries(this.account.id, this.pageNumber);
  }

  getUserName(): string {
    return this.keycloakService.getUsername();
  }

  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  isAdmin(): boolean {
    return this.keycloakService.isUserInRole("admin");
  }

  buildAndShowMenu(event: any) {
    this.accountMenu = [];
    if (this.writeAllowed && this.subAccounts.length == 0)
      this.accountMenu.push({label: 'Saisir une écriture', routerLink: `/transactions/create/${this.account.id}`});
    if (this.user.admin)
      this.accountMenu.push({label: 'Créer un sous-compte', routerLink: '/accounts/create'});
    this.menu?.toggle(event);
  }
}
