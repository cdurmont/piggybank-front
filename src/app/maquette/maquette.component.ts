import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-maquette',
  templateUrl: './maquette.component.html',
  styleUrls: ['./maquette.component.css']
})
export class MaquetteComponent implements OnInit {

  userMenuContent: MenuItem[] = [ {label: 'Mon Profil'},

    {label: 'Mes moyens de paiement', routerLink: ['/quickInputs']},
    {label: 'Mes saisies rapides', routerLink: ['/quickInputs']},
    {label: 'Déconnexion'}];

  mainMenuContent: MenuItem[] = [
    {label: 'Tous les comptes', routerLink: ['/']},
    {label: 'Transactions récurrentes', routerLink: ['/transactions/recurring']},
    {label: 'Import', routerLink: ['/import']},
    {label: 'Utilisateurs et droits', routerLink: ['/admin/users']},
  ];

  pageMaquette: string = 'accueil';

  constructor() { }

  ngOnInit(): void {
  }

  changePage(page: string) {
    this.pageMaquette = page;
  }
}
