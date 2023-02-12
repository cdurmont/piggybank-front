import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../../core/services/account.service";
import {MessageService} from "primeng/api";
import IStat from "../../../shared/models/IStat";
import IAccount from "../../../shared/models/IAccount";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private messageService: MessageService,
              private accountService: AccountService,
  ) {
  }

  stats: IStat[] = [];
  chartData: any = {};

  chartOptions: any = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };
  account: IAccount = {};

  ngOnInit(): void {

    this.route.params.subscribe(async value => {
      let id = value.id;
      this.accountService.read(1, {id: id}).subscribe(
        accounts => {
          if (accounts && accounts.length == 1) {
            this.account = accounts[0];
            this.accountService.getStats(1, {id: id}).subscribe(
              stats => {
                this.stats = stats;
                this.formatChartData(stats);
              },
              error => {
                this.messageService.add({severity: 'error', summary: "Erreur de lecture des stats du compte", data: error})
              }
            );

          }
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur de lecture des stats du compte", data: error})
        }
      );
    });
    }

  private formatChartData(stats: IStat[]) {
    const borderGood = '#007600', backgroundGood = 'rgba(0,118,0,0.2)';
    const borderBad = '#760000', backgroundBad = 'rgba(118,0,0,0.2)';
    let chartData:any = {
      labels: [],
      datasets: [
        {
          type: 'line',
          label: 'Solde',
          fill: false,
          borderColor: '#000076',
          data: []
        },
        {
          type: 'line',
          label: 'Débit',
          fill: true,
          borderColor: this.account.colorRevert ? borderBad : borderGood,
          backgroundColor: this.account.colorRevert ? backgroundBad : backgroundGood,
          data: []
        },
        {
          type: 'line',
          label: 'Crédit',
          fill: true,
          borderColor: this.account.colorRevert ? borderGood : borderBad,
          backgroundColor: this.account.colorRevert ? backgroundGood : backgroundBad,
          data: []
        }
      ]
    };
    let solde:number = 0;
    stats.forEach(stat => {
      chartData.labels.push(`${stat.month}/${stat.year}`);
      if (this.account.colorRevert)
        { // @ts-ignore
          solde += stat.credit - stat.debit;
        }
      else
        { // @ts-ignore
          solde += stat.debit - stat.credit;
        }
      chartData.datasets[0].data.push(solde);
      chartData.datasets[1].data.push(stat.debit);
      chartData.datasets[2].data.push(stat.credit);
    });

    this.chartData = chartData;
  }
}
