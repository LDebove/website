import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terraria-pixelart',
  templateUrl: './terraria-pixelart.component.html',
  styleUrls: ['./terraria-pixelart.component.scss']
})
export class TerrariaPixelartComponent implements AfterViewInit {

  constructor(private title: Title, private translate: TranslateService) { }

  ngAfterViewInit(): void {
    this.title.setTitle(`${this.translate.instant('APPS.TERRARIA-PIXELART')} - Léo Debove`);
    this.translate.onLangChange.subscribe({
      next: () => {
        this.title.setTitle(`${this.translate.instant('APPS.TERRARIA-PIXELART')} - Léo Debove`);
      }
    });
  }

}
