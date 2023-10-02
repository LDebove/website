import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { IColorDictionary } from '../image-editor/editor.model';

@Component({
  selector: 'app-terraria-pixelart',
  templateUrl: './terraria-pixelart.component.html',
  styleUrls: ['./terraria-pixelart.component.scss']
})
export class TerrariaPixelartComponent implements AfterViewInit {

  canvasColors: IColorDictionary = {};

  constructor(private title: Title, private translate: TranslateService) { }

  ngAfterViewInit(): void {
    this.title.setTitle(`${this.translate.instant('APPS.TERRARIA-PIXELART')} - Léo Debove`);
    this.translate.onLangChange.subscribe({
      next: () => {
        this.title.setTitle(`${this.translate.instant('APPS.TERRARIA-PIXELART')} - Léo Debove`);
      }
    });
  }

  setCanvas(imageLoadEvent: Event): void {

  }

}
