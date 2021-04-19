import {Component, OnInit} from '@angular/core';
import IUser from "../../../shared/models/IUser";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: IUser ={};
  createMode:boolean = false;

  constructor(private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService
              ) { }

  ngOnInit(): void {
    const id:string | null = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.createMode = true;
    }
    else
    {
      this.userService.getById(id).subscribe(
        value => {
          this.user = value[0];
        },
        error => { this.messageService.add({severity: 'error', summary: "Erreur de récupération de l'utilisateur "+id, data: error}) }
      );
    }

  }

  save(): void {
    if (this.formValid())
      if (this.createMode) {
        this.userService.create(this.user).subscribe(
          value => {
            this.user = value;
            this.messageService.add({severity: 'success', summary: "Utilisateur créé "});
            this.router.navigate(['/admin/users']).catch(() => {console.error('error navigating to admin/users')});
          }, error => {
            this.messageService.add({severity: 'error', summary: "Erreur à la création de l'utilisateur ", data: error})
          });
      }
      else {
        this.userService.update(this.user).subscribe(
          value => {
            this.user = value;
            this.messageService.add({severity: 'success', summary: "Utilisateur enregistré "});
            this.router.navigate(['/admin/users']).catch(() => {console.error('error navigating to admin/users')});
          }, error => {
            this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement l'utilisateur ", data: error})
          });
      }
  }

  formValid():boolean {
    let valid=true;
    if (!this.user.login) {
      this.messageService.add({severity: 'error', summary: "L'identifiant est obligatoire"});
      valid = false;
    }
    if (!this.user.name) {
      this.messageService.add({severity: 'error', summary: "Le nom est obligatoire"});
      valid = false;
    }
    if (this.createMode && !this.user.hash) {
      this.messageService.add({severity: 'error', summary: "Le mot de passe est obligatoire"});
      valid = false;
    }
    return valid;
  }
}
