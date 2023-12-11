import { Component, OnInit } from '@angular/core';
import IAccount from "../../shared/models/IAccount";
import ITransaction from "../../shared/models/ITransaction";
import {MessageService} from "primeng/api";
import {TransactionService} from "../../core/services/transaction.service";
import IAssociation from "../../shared/models/IAssociation";
import {AssociationService} from "../../core/services/association.service";

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  createOrLinkValues = [{name: "Créer", value:'C'},{name: "Lier", value: 'L'}];
  createOrLink:string = 'C';

  importedTransactions: ITransaction[] = [];

  association: IAssociation = {account: {}};
  associatingTransaction: ITransaction = {};

  accountId:number = 42;
  importAccount: IAccount = {};

  nbPending:number = 0;

  detailsDialogData = {
    visible: false,
    title: '',
    additionalData: {},
  }

  private createMode: boolean = true; //used for associations

  constructor(private messageService: MessageService,
              private transactionService: TransactionService,
              private associationService: AssociationService,
              ) { }

  ngOnInit(): void {
    this.loadAssociationsAndTransactions();
  }

  private loadAssociationsAndTransactions() {
    this.associationService.read(1, {}).subscribe(associations => {
      this.transactionService.read(1, {type: 'I'}).subscribe(
        txnList => {
          if (txnList) {
            txnList.sort((a, b) => {
              // @ts-ignore
              return new Date(a.entries[0].date).getTime() - new Date(b.entries[0].date).getTime();
            });
            txnList.forEach(txn => {
              if (!txn.entries) // shouldn't happen
                txn.entries = [];
              if (txn.entries.length == 0)  // shouldn't happen too
                txn.entries.push({account: {}, date: new Date()});
              if (txn.entries.length == 1)  // that, should happen every time
                txn.entries.push({
                  account: {},
                  date: txn.entries[0].date,
                  debit: txn.entries[0].credit,
                  credit: txn.entries[0].debit,
                });
              txn.entries.forEach(entry => {
                if (entry.date) entry.date = new Date(entry.date)
              }); // revive dates
              // try to associate to an account
              if (associations)
                associations.forEach(assoc => {
                  if (assoc.regex && txn.description) {
                    let regexp = new RegExp(assoc.regex);
                    if (regexp.test(txn.description)) {
                      // @ts-ignore
                      txn.entries[1].account = assoc.account;
                    }
                  }
                });
            });
          }

          this.importedTransactions = txnList;
        }, error => {
          this.messageService.add({severity: 'error', summary: "Erreur lors de la lecture des transactions importées"});
          console.error(error);
        }
      );

    });
  }


  accountSelected(parent: IAccount, account:IAccount): void {
    account.parent = parent;
  }

  accountSelectedTxn(account: IAccount, txn:ITransaction): void {
    if (txn && txn.entries && txn.entries.length>1) {
      txn.entries[1].account = account;
      if (account && account.id)
        txn.selected = true;
    }
  }



  transactionCreated(): void {
    if ( --this.nbPending == 0) {
      this.loadAssociationsAndTransactions();
    }
  }

  importTransactions():void {
    this.nbPending = 0;
    // count the number of transactions to be saved
    this.importedTransactions.forEach(txn => {
      if (ImportComponent.isReadyForImport(txn)) {
        this.nbPending++;
      }
    });

    this.importedTransactions.forEach(txn => {
      if (ImportComponent.isReadyForImport(txn)) {
        txn.type = 'S'; // this is now a standard transaction
        txn.assignDialogVisible = undefined;  // remove all presentation attributes
        txn.selected = undefined;
        txn.appliedAssociation = undefined;
        // @ts-ignore
        this.transactionService.update(1, txn).subscribe(
          () => {
            this.messageService.add({severity: 'success', summary: "Transaction '" + txn.description + "' importée"});
            this.transactionCreated();
          }, error => {
            this.messageService.add({severity: 'error', summary: "Erreur lors de l'enregistrement de la transaction"});
            console.error(error);
            this.transactionCreated();
          }
        );
      }
    });
  }

  private static isReadyForImport(txn: ITransaction) {
    return txn.entries && txn.entries.length == 2 && txn.entries[1].account && txn.entries[1].account.id && txn.selected;
  }

  showDialogAssign(txn: ITransaction) {
    txn.assignDialogVisible = true;
    // @ts-ignore
    this.association = {  regex: txn.description,
                          account: txn.entries && txn.entries.length>1 ? txn.entries[1].account : undefined};
    this.associatingTransaction = txn;
  }

  cancelAssign() {
    this.associatingTransaction.assignDialogVisible = false;
  }

  saveAssign() {
    if (this.createMode)
      this.associationService.create(1, this.association).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: "Règle d'association créée"});
          this.associatingTransaction.assignDialogVisible = false;
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement de l'association", data: error});
          console.error(error);
        }
      );
    else
      this.associationService.update(1, this.association).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: "Règle d'association modifiée"});
          this.associatingTransaction.assignDialogVisible = false;
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement du compte", data: error});
          console.error(error);
        }
      );

  }

  accountSelectedAssoc(account: IAccount) {
    this.association.account = account;
  }

  accountSelectedImport(account: IAccount) {
    this.accountId = account ? account.id : null;
  }

  beforeUpload(evt:any) {
    evt.formData.set("accountId",this.accountId);
  }

  fileUploaded() {
    this.messageService.add({severity: 'success', summary: "Fichier importé"});
    this.loadAssociationsAndTransactions();
  }

  showDetails(txn: ITransaction) {
    this.detailsDialogData.title = txn.description || '(sans description)';
    this.detailsDialogData.additionalData = JSON.parse(txn.additionalData);
    this.detailsDialogData.visible = true;
  }
}
