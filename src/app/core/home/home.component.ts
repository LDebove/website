import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  constructor(private title: Title, private translate: TranslateService) { }

  ngAfterViewInit(): void {
    this.title.setTitle(`${this.translate.instant('APPS.HOME')} - Léo Debove`);
    this.translate.onLangChange.subscribe({
      next: () => {
        this.title.setTitle(`${this.translate.instant('APPS.HOME')} - Léo Debove`);
      }
    });
  }
}
