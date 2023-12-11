import {Component, OnInit} from '@angular/core';
import {Connection} from "../../../shared/models/connection.model";
import {ConnectionService} from "../../../core/services/connection.service";
import {NgxPlaidLinkService, PlaidConfig} from "ngx-plaid-link";
import {ConfirmationService, MessageService} from "primeng/api";
import {AccountService} from "../../../core/services/account.service";
import {Account} from "../../../shared/models/account.model";
import IAccount from "../../../shared/models/IAccount";
import ITransaction from "../../../shared/models/ITransaction";


@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.css']
})
export class ConnectionListComponent implements OnInit {

  connections: Connection[] = [];
  linkToken: string = '';
  syncedTransactions: string = '';

  constructor(private connectionService: ConnectionService,
              private accountService: AccountService,
              private plaidLinkService: NgxPlaidLinkService,
              private messageService: MessageService,
              private confirmService: ConfirmationService,
  ) {
  }

  ngOnInit() {

    this.fetchConnections();
  }

  fetchConnections() {
    this.connectionService.read().subscribe(result => {
      this.fetchLinkedAccounts(result);
    });
  }

  private fetchLinkedAccounts(connections: Connection[]) {
    this.accountService.read(1, {}).subscribe(accounts => {
      // relie les comptes (piggy) aux comptes bancaires de la connexion
      connections.forEach(conn => {
        conn.accounts?.forEach(bankAccount => {
          if (bankAccount.piggyAccountId) {
            const piggyAccount = accounts.find(acc => acc.id === bankAccount.piggyAccountId);
            if (piggyAccount)
              bankAccount.piggyAccount = piggyAccount;
          }
        });
      });

      this.connections = connections;

    })
  }


  addConnection() {
    this.connectionService.createPublicToken().subscribe(response => {
      this.linkToken = response.token;
      const plaidConf: PlaidConfig = {
        token: response.token,
        countryCodes: ['FR'],
        product: ['transactions'],
        env: response.environment,
        clientName: 'PiggyBank',
        onSuccess: (publicToken: string) => {
          this.connectionAdded(publicToken)
        },
        onExit: () => {
        }
      };
      this.plaidLinkService.createPlaid(plaidConf).then(handler => {
        handler.open();
      });
    });
  }

  connectionAdded(publicToken: string) {
    this.connectionService.create(publicToken, new Date(), 1).subscribe(response => {
      if (response.accessToken) {
        this.messageService.add({severity: 'success', summary: "Nouvelle connexion créée"});
        this.fetchConnections();
      } else
        this.messageService.add({severity: 'error', summary: `Erreur de création (${response.message})`});
    })
  }

  deleteConnection(conn: Connection) {
    this.confirmService.confirm({
      icon: 'pi pi-exclamation-triangle',
      message: `Etes-vous sûr de vouloir supprimer la connexion bancaire à ${conn.bankName} ?`,
      accept: () => {
        this.connectionService.delete(conn).subscribe(response => {
          if (response.accessToken) {
            this.messageService.add({severity: 'success', summary: "Connexion supprimée"});
            this.fetchConnections();
          } else
            this.messageService.add({
              severity: 'error',
              summary: `Erreur de suppression (${JSON.stringify(response)})`,
              data: response
            });
        });
      }
    });
  }

  setAccount(connection: Connection, bankAccount: Account, piggyAccount: IAccount) {
    if (bankAccount.piggyAccountId != piggyAccount.id ) {
      bankAccount.piggyAccountId = piggyAccount.id;
      if (!bankAccount.piggyAccountId)
        bankAccount.piggyAccountId = null;
      bankAccount.piggyAccount = undefined;
      console.log(`update connection ${JSON.stringify(connection)}`);
      this.connectionService.update(connection).subscribe(() => {
          this.messageService.add({severity: 'success', summary: piggyAccount.id ? "Compte associé" : "Compte dissocié"});
          this.fetchConnections();
        }, error => {
          this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement du compte", data: error});
          this.fetchConnections();
        }
      );

    }

  }

  sync() {
    this.connectionService.sync().subscribe(
      result => {
        this.syncedTransactions = JSON.stringify(result);
      }
    );
  }
}
