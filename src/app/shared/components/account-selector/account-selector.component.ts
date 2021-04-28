import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccountsComponent} from "../../../features/accounts/accounts.component";
import {AccountService} from "../../../core/services/account.service";
import {MessageService} from "primeng/api";
import IAccount from "../../models/IAccount";

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent extends AccountsComponent {

  @Input()
  label: string | undefined;
  @Output()
  onAccountSelect: EventEmitter<IAccount> = new EventEmitter<IAccount>();
  selectedLabel: string | undefined;

  constructor(accountService: AccountService,
              messageService: MessageService) {
    super(accountService, messageService);
  }

  nodeSelect(event: any, op:any): void {
    op.hide(event);
    this.selectedLabel = event.node.label;
    this.onAccountSelect.emit(event.node.data);
  }

  clear(): void {
    this.onAccountSelect.emit();
    this.selectedLabel = undefined;
  }
}
