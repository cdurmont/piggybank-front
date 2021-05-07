import { Component, OnInit } from '@angular/core';
import ITransaction from "../../../shared/models/ITransaction";
import {TransactionService} from "../../../core/services/transaction.service";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";

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
  ) { }

  ngOnInit(): void {
    this.contextMenu = [
      {label: "Modifier", icon:'pi pi-fw pi-pencil', command: () => { this.update()}},
      {label: "Supprimer", icon:'pi pi-fw pi-trash', command: () => { this.delete()}},
    ];

    this.transactionService.read({type: 'R'}).subscribe(
      txns => {
        this.transactions = txns; // TODO sort transactions
      }, error => {
        this.messageService.add({severity: 'error', summary: "Erreur à la lecture des transactions récurrentes", data: error});
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

}
