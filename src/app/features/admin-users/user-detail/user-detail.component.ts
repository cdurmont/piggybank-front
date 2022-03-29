import {Component, OnInit} from '@angular/core';
import IUser from "../../../shared/models/IUser";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";
import {PermissionService} from "../../../core/services/permission.service";
import IPermission from "../../../shared/models/IPermission";
import IAccount from "../../../shared/models/IAccount";



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: IUser ={};
  createMode:boolean = false;
  permissions: IPermission[] = [];
  deletedPermissions: IPermission[] = [];
  accessModes = [{name:'Consultation', code:'R'}, {name:'Modification', code: 'W'}];
  changePass:boolean = false;

  constructor(private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private permissionService: PermissionService,
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
      this.permissionService.read({user: {_id: id}}).subscribe(
        value => {
          value.push({user: {_id: id}, account: {} , type: 'R'});
          this.permissions = value;
        }, error => {
          this.messageService.add({severity: 'error', summary: "Erreur de récupération des permissions de l'utilisateur "+id, data: error});
        }
      );
    }
  }

  save(): void {
    if (this.formValid())
      if (this.createMode) {
        this.userService.create(this.user).subscribe(
          value => {
            this.user = value;
            this.savePermissions();
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
            this.savePermissions();
            this.messageService.add({severity: 'success', summary: "Utilisateur enregistré "});
            this.router.navigate(['/admin/users']).catch(() => {console.error('error navigating to admin/users')});
          }, error => {
            this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement l'utilisateur ", data: error})
          });
      }
  }

  savePermissions(): void {
    if (!this.user.admin) {
      this.deletedPermissions.forEach(perm => {
        this.permissionService.delete(perm).subscribe(value => {}, error => {this.messageService.add({severity: 'error', summary: "Erreur à la suppression d'une permission ", data: error})})
      });

      this.permissions.forEach(perm => {
        if (perm.account._id) {
          if (perm._id)
            this.permissionService.update(perm).subscribe(value => {}, error => {this.messageService.add({severity: 'error', summary: "Erreur à la modification d'une permission ", data: error})});
          else
            this.permissionService.create(perm).subscribe(value => {}, error => {this.messageService.add({severity: 'error', summary: "Erreur à la création d'une permission ", data: error})});
        }
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

  setAccount(account: IAccount, perm: any) {
    perm.account = account;
    let emptyLinePresent:boolean = this.permissions
      .map<boolean>(value => { return value.account._id === undefined})
      .reduce((previousValue, currentValue) => { return previousValue || currentValue});
    if (!emptyLinePresent)
      this.permissions.push({user: this.user, account: {}, type: 'R'});
  }

  remove(perm: IPermission) {
    let idx = this.permissions.indexOf(perm);
    if (idx>-1)
      this.permissions.splice(idx, 1);
    if (perm._id)
      this.deletedPermissions.push(perm);
  }
}
