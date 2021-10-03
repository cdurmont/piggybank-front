import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AccountsComponent} from "../../../features/accounts/accounts.component";
import {AccountService} from "../../../core/services/account.service";
import {MessageService} from "primeng/api";
import IAccount from "../../models/IAccount";
import {TransactionService} from "../../../core/services/transaction.service";
import {LoginService} from "../../../core/services/login.service";

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent extends AccountsComponent {

  @Input()
  label: string | undefined;
  @Input()
  account: IAccount = {};
  @Input()
  placeholder: string = "Compte";
  @Output()
  onAccountSelect: EventEmitter<IAccount> = new EventEmitter<IAccount>();
  selectedLabel: string | undefined;
  visible: boolean = false;

  constructor(accountService: AccountService,
              messageService: MessageService,
              transactionService: TransactionService,
              loginService: LoginService,
              ) {
    super(accountService, messageService, transactionService, loginService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onAccountSelect.emit(this.account);
    this.selectedLabel = this.account?.name;
  }

  nodeSelect(event: any): void {
    this.visible = false;
    this.account = event.node.data;
    this.selectedLabel = event.node.label;
    this.onAccountSelect.emit(event.node.data);
  }

  clear(): void {
    this.onAccountSelect.emit({});
    this.selectedLabel = undefined;
    this.account = {};
  }

  show(): void {
    this.visible = true;
  }
}
