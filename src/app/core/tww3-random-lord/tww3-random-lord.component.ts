import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Lord } from 'src/app/models/lord.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tww3-random-lord',
  templateUrl: './tww3-random-lord.component.html',
  styleUrls: ['./tww3-random-lord.component.scss']
})
export class Tww3RandomLordComponent implements OnInit, AfterViewInit {

  lords: Lord[] = [];

  constructor(private title: Title, private translate: TranslateService, private api: ApiService) { }

  ngOnInit(): void {
    this.api.get('lords').subscribe({
      next: (response) => {
        if(response.data?.lords) {
          this.lords = response.data.lords;
          console.log(this.lords);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.title.setTitle(`${this.translate.instant('APPS.TWW3-RANDOM-LORD')} - Léo Debove`);
    this.translate.onLangChange.subscribe({
      next: () => {
        this.title.setTitle(`${this.translate.instant('APPS.TWW3-RANDOM-LORD')} - Léo Debove`);
      }
    });
  }
}
