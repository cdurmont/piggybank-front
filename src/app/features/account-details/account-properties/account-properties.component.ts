import {Component, OnInit} from '@angular/core';
import IAccount from "../../../shared/models/IAccount";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AccountService} from "../../../core/services/account.service";
import {ConfirmationService, MessageService, PrimeIcons} from "primeng/api";

@Component({
  selector: 'app-account-properties',
  templateUrl: './account-properties.component.html',
  styleUrls: ['./account-properties.component.css']
})
export class AccountPropertiesComponent implements OnInit {

  account: IAccount = {type: 'U', parent: {}};
  createMode: boolean = true;

  displayColors: boolean =false;
  displayIcons: boolean =false;

  colors: string[] = ['black-alpha', 'blue', 'bluegray', 'cyan', 'gray', 'green', 'indigo', 'orange', 'pink', 'primary',
    'purple', 'red', 'teal', 'white-alpha', 'yellow'];

  icons: string[] =[];

  selectedColor: string = 'blue';
  selectedIcon: string = 'pi pi-shopping-cart';

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private messageService: MessageService,
              private location: Location,
              private confirmService: ConfirmationService,
              private router: Router,
  ) {
  }

  ngOnInit(): void {

    for (const iconProp in PrimeIcons) {
      // @ts-ignore
      this.icons.push(PrimeIcons[iconProp]);
    }
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.accountService.read(1, {id: id}).subscribe(
        value => {
          if (value && value.length == 1) {
            this.account = value[0];
            this.createMode = false;
            this.selectedColor = this.account.color ? this.account.color : 'blue';
            this.selectedIcon = this.account.icon ? this.account.icon : 'pi pi-tag';
          }
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur de lecture du compte", data: error})
        }
      );
    }
  }

  save(): void {
    this.account.color = this.selectedColor;
    this.account.icon = this.selectedIcon;
    if (this.createMode)
      this.accountService.create(1, this.account).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: "Compte créé"});
          this.location.back();
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement du compte", data: error});
          console.error(error);
        }
      );
    else
      this.accountService.update(1, this.account).subscribe(
        () => {
          this.messageService.add({severity: 'success', summary: "Compte modifié"});
          this.location.back();
        },
        error => {
          this.messageService.add({severity: 'error', summary: "Erreur à l'enregistrement du compte", data: error});
          console.error(error);
        }
      );


  }

  delete(): void {
    this.confirmService.confirm({
        icon: 'pi pi-exclamation-triangle',
        message: "Etes-vous sûr de vouloir supprimer ce compte ?",
        accept: () => {
          this.accountService.delete(1, this.account).subscribe(
            value => {
              this.messageService.add({severity: 'success', summary: "Compte supprimé"});
              this.router.navigate(['/']).catch(() => {console.error('error navigating to main page')});
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: "Erreur lors de la suppression du compte",
                data: error
              })
            })
        }
      }
    )

  }

  cancel(): void {
    this.location.back();
  }

  setParent(parent: IAccount | undefined): void {
    this.account.parent = parent;
  }

  showColors() {
    this.displayColors = !this.displayColors;
  }
  showIcons() {
    this.displayIcons = !this.displayIcons;
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.displayColors = false;
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.displayIcons = false;
  }
}
