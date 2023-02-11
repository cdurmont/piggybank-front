import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../../core/services/account.service";
import {UserService} from "../../../core/services/user.service";
import {PermissionService} from "../../../core/services/permission.service";
import {KeycloakService} from "keycloak-angular";
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
              private userService: UserService,
              private permissionService: PermissionService,
              private keycloakService: KeycloakService
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
      this.accountService.getStats(1, {id: id}).subscribe(
        value => {
          this.stats = value;
          this.formatChartData(value);
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur de lecture des stats du compte", data: error})
        }
      );
      this.accountService.read(1, {id: id}).subscribe(
        value => {
          if (value && value.length == 1)
            this.account = value[0];
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur de lecture des stats du compte", data: error})
        }
      );
    });
    }

  private formatChartData(stats: IStat[]) {
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
          borderColor: '#007600',
          backgroundColor: 'rgba(0,118,0,0.2)',
          data: []
        },
        {
          type: 'line',
          label: 'Crédit',
          fill: true,
          borderColor: '#760000',
          backgroundColor: 'rgba(118,0,0,0.2)',
          data: []
        }
      ]
    };
    let solde:number = 0;
    stats.forEach(stat => {
      chartData.labels.push(`${stat.month}/${stat.year}`);
      // @ts-ignore
      solde += stat.credit - stat.debit;
      chartData.datasets[0].data.push(solde);
      chartData.datasets[1].data.push(stat.debit);
      chartData.datasets[2].data.push(stat.credit);
    });

    this.chartData = chartData;
  }
}
