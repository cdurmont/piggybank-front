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
    this.userService.read().subscribe(value => { this.users = value},
      error => {
        this.messageService.add({severity:'error', summary: "Erreur à la lecture des utilisateurs", data: error});
      })
  }

}
