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

  @Input()
  public raw:boolean = false;
  balance:number = 0;
  className:string = '';

  constructor(private messageService: MessageService,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getBalance(1, this.account).subscribe(balance => {

      let positive:boolean = (balance >= 0);
      if (this.account.colorRevert)
        positive = !positive;
      this.className = positive ? 'good' : 'bad';
      this.balance = Math.abs(balance);
    })
  }

}
