import { Component, OnInit } from '@angular/core';
import {UserService} from "../../core/services/user.service";
import IUser from "../../shared/models/IUser";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: IUser[] = [];

  constructor(private userService: UserService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadUserList();
  }

  private loadUserList():void {
    this.userService.read().subscribe(value => { this.users = value},
      error => {
        this.messageService.add({severity:'error', summary: "Erreur à la lecture des utilisateurs", data: error});
      })
  }

  delete(user: IUser):void {
    this.userService.delete(user).subscribe(
      () => {
        this.messageService.add({severity:'success', summary: "Utilisateur supprimé"});
        this.loadUserList();
      },
      error => { this.messageService.add({severity:'error', summary: "Erreur à la suppression de l'utilisateur", data: error}) });
  }
}
