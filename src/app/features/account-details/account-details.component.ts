import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import IAccount from "../../shared/models/IAccount";
import {AccountService} from "../../core/services/account.service";
import {MessageService} from "primeng/api";
import {EntryService} from "../../core/services/entry.service";
import IEntry from "../../shared/models/IEntry";

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

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private entryService: EntryService,
              private messageService: MessageService,
              ) { }

  ngOnInit(): void {
    // main account
    let id = this.route.snapshot.paramMap.get('id');
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
    this.entryService.read({account: {_id: id}}).subscribe(
      value => { this.entries = value },
      error => { this.messageService.add({severity: 'error', summary: "Erreur de lecture des écritures du compte", data: error})}
    );
  }

  toggleSubAccounts() {
    this.showSubAccounts = ! this.showSubAccounts;
  }
}
