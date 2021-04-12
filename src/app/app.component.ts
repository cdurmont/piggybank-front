import {Component, OnInit} from '@angular/core';
import { VersionService } from "./core/services/version.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PiggyBank';
  username = '';
  version = '';

  constructor(public versionService: VersionService) {
  }

  ngOnInit(): void {
    this.versionService.getVersion().subscribe(value => {
      this.version = value.version;
      console.log(`Version number fetched : ${value.version}`);
    });
  }

}
