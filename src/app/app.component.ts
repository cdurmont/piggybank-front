import {Component, OnInit} from '@angular/core';
import { VersionService } from "./core/services/version.service";
import IUser from "./shared/models/IUser";
import {LoginService} from "./core/services/login.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'PiggyBank';
  username = '';
  version = '';

  user: IUser | undefined;

  constructor(private versionService: VersionService,
              private loginService: LoginService) {
    loginService.getUser().subscribe(value => { this.user = value});
  }

  ngOnInit(): void {
    this.versionService.getVersion().subscribe(value => {
      this.version = value.version;
      console.log(`Version number fetched : ${value.version}`);
    });
  }

}
