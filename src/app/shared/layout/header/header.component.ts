import { AfterContentInit, Component, HostListener } from '@angular/core';
import { OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterContentInit {
  appLinks: any = [
    { translationKey: 'APPS.HOME', path: '/home' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
  ];
  mobile: boolean = false;
  showHeaderLinks: boolean = false;

  @HostListener('window:resize') onResize(): void {
    if(document.documentElement.clientWidth < 501) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.setColorTheme(false);
  }

  ngAfterContentInit(): void {
    if(document.documentElement.clientWidth < 501) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  /**
   * sets the color theme of the app using css global variables
   * @param lightMode true for lightMode, false for darkMode
   * TODO set a cookie to store theme preferences
   */
  setColorTheme(lightMode: boolean): void {
    let themeSelected: any;
    if(lightMode) {
      themeSelected = require('src/assets/themes/light-mode.json');
    } else {
      themeSelected = require('src/assets/themes/dark-mode.json');
    }
    Object.keys(themeSelected).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, themeSelected[key]);
    });
  }

  /**
   * sets the language used on the page
   * @param language 'en' or 'fr'
   * TODO set a cookie to store language preferences
   */
  setLanguage(language: string) {
    this.translate.use(language);
  }
}
