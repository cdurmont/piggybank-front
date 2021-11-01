import {Component, Input, OnInit} from '@angular/core';
import IAccount from "../../models/IAccount";
import {MessageService} from "primeng/api";
import {AccountService} from "../../../core/services/account.service";

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  @Input()
  public account: IAccount = {};
  balance:number = 0;
  className:string = '';

  constructor(private messageService: MessageService,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getBalance(this.account).subscribe(account => {
      let positive:boolean = (account.balance >= 0);
      if (this.account.colorRevert)
        positive = !positive;
      this.className = positive ? 'good' : 'bad';
      this.balance = Math.abs(account.balance);
    })
  }

}
