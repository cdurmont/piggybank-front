import { Component, OnInit } from '@angular/core';
import ITransaction from "../../../shared/models/ITransaction";
import {TransactionService} from "../../../core/services/transaction.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {EntryService} from "../../../core/services/entry.service";

@Component({
  selector: 'app-recur',
  templateUrl: './recur.component.html',
  styleUrls: ['./recur.component.css']
})
export class RecurComponent implements OnInit {

  transactions: ITransaction[] =[];
  contextMenu: MenuItem[] = [];
  selectedTransaction: ITransaction = {};

  constructor(
    private messageService: MessageService,
    private router: Router,
    private confirmService: ConfirmationService,
    private transactionService: TransactionService,
    private entryService: EntryService,
  ) { }

  ngOnInit(): void {
    this.contextMenu = [
      {label: "Modifier", icon:'pi pi-fw pi-pencil', command: () => { this.update()}},
      {label: "Dupliquer", icon:'pi pi-fw pi-copy', command: () => { this.duplicate()}},
      {label: "Supprimer", icon:'pi pi-fw pi-trash', command: () => { this.delete()}},
    ];
    this.initTransactions();
  }


  private initTransactions() {
    this.transactionService.read({type: 'R'}).subscribe(
      txns => {
        this.transactions = txns; // TODO sort transactions
      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: "Erreur à la lecture des transactions récurrentes",
          data: error
        });
        console.error(error);
      }
    );
  }

  private delete() {
    this.confirmService.confirm({
      icon: 'pi pi-exclamation-triangle',
      message: "Etes-vous sûr de vouloir supprimer l'ensemble de la transaction ?",
      accept: () => {
        this.transactionService.delete(this.selectedTransaction).subscribe(
          () => {
            this.messageService.add({severity: 'success', summary: "Transaction supprimée"});
            this.ngOnInit();
          }, error => {
            this.messageService.add({severity: 'error', summary: "Erreur lors de la suppression de la transaction", data: error});
          })
      }
    })
  }

  private update() {
    this.router.navigate([`/transactions/update/${this.selectedTransaction._id}`]).catch(() => {console.error('error navigating to transaction details')});
  }

  private duplicate() {
    // read transaction entries
    this.entryService.read({transaction: { _id:this.selectedTransaction._id}}).subscribe(
      entries => {
        this.selectedTransaction.description = "Copie de " +this.selectedTransaction.description;
        // clean up ids
        this.selectedTransaction._id = undefined;
        entries.forEach(entry => {
          entry._id = undefined;
        })
        this.selectedTransaction.entries = entries;
        this.transactionService.create(this.selectedTransaction).subscribe(
          () => {
            this.messageService.add({severity: 'success', summary: "Transaction dupliquée"});
            this.initTransactions();
          }, error => {
            this.messageService.add({
              severity: 'error',
              summary: "Erreur à la duplication de la transaction",
              data: error
            });
            console.error(error);
          }
        );
      }, error => {
        this.messageService.add({severity: 'error', summary: "Impossible de lire la transaction", data: error});
        console.error(error);
      }
    );

  }
}
