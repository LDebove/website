import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tww3-random-lord',
  templateUrl: './tww3-random-lord.component.html',
  styleUrls: ['./tww3-random-lord.component.scss']
})
export class Tww3RandomLordComponent implements AfterViewInit {

  constructor(private title: Title, private translate: TranslateService) { }

  ngAfterViewInit(): void {
    this.title.setTitle(`${this.translate.instant('APPS.TWW3-RANDOM-LORD')} - Léo Debove`);
    this.translate.onLangChange.subscribe({
      next: () => {
        this.title.setTitle(`${this.translate.instant('APPS.TWW3-RANDOM-LORD')} - Léo Debove`);
      }
    });
  }
}
