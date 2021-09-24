import { Component, OnInit } from '@angular/core';
import ITransaction from "../../shared/models/ITransaction";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {TransactionService} from "../../core/services/transaction.service";
import {LoginService} from "../../core/services/login.service";

@Component({
  selector: 'app-quickinputs',
  templateUrl: './quickinputs.component.html',
  styleUrls: ['./quickinputs.component.css']
})
export class QuickinputsComponent implements OnInit {

  transactions: ITransaction[] =[];
  contextMenu: MenuItem[] = [];
  selectedTransaction: ITransaction = {};

  constructor(
    private messageService: MessageService,
    private router: Router,
    private confirmService: ConfirmationService,
    private transactionService: TransactionService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.contextMenu = [
      {label: "Modifier", icon:'pi pi-fw pi-pencil', command: () => { this.update()}},
      {label: "Supprimer", icon:'pi pi-fw pi-trash', command: () => { this.delete()}},
    ];
    this.loginService.getUser().subscribe(user => {
      this.transactionService.read({type: 'Q', owner: user}).subscribe(
        txns => {
          this.transactions = txns;
        }, error => {
          this.messageService.add({severity: 'error', summary: "Erreur à la lecture des saisies rapides", data: error});
          console.error(error);
        }
      );
    });
  }


  private delete() {
    this.confirmService.confirm({
      icon: 'pi pi-exclamation-triangle',
      message: "Etes-vous sûr de vouloir supprimer cette saisie rapide ?",
      accept: () => {
        this.transactionService.delete(this.selectedTransaction).subscribe(
          () => {
            this.messageService.add({severity: 'success', summary: "Saisie rapide supprimée"});
            this.ngOnInit();
          }, error => {
            this.messageService.add({severity: 'error', summary: "Erreur lors de la suppression de la saisie rapide", data: error});
          })
      }
    })
  }

  private update() {
    this.router.navigate([`/transactions/update/${this.selectedTransaction._id}`]).catch(() => {console.error('error navigating to transaction details')});
  }

}
