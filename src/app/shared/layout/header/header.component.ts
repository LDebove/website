import { AfterContentInit, Component, HostListener } from '@angular/core';
import { OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/services/popup.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserAgentService } from 'src/app/services/user-agent.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterContentInit {
  appLinks: any = [
    { translationKey: 'APPS.HOME', path: '/home' },
    { translationKey: 'APPS.IMAGE-EDITOR', path: '/image-editor' },
    { translationKey: 'APPS.TWW3-RANDOM-LORD', path: '/tww3-random-lord' },
    { translationKey: 'APPS.TERRARIA-PIXELART', path: '/terraria-pixelart' },
  ];
  mobileDisplay: boolean = false;
  mobileUa: boolean = false;
  showHeaderLinks: boolean = false;
  headerInit: boolean = true;

  @HostListener('window:resize') onResize(): void {
    if(document.documentElement.clientWidth < 501) {
      this.mobileDisplay = true;
    } else {
      this.mobileDisplay = false;
    }
  }

  constructor(private translate: TranslateService, private ua: UserAgentService, private theme: ThemeService, private popup: PopupService) { }

  ngOnInit(): void {
    this.mobileUa = this.ua.isMobile();
    this.setColorTheme(false);
  }

  ngAfterContentInit(): void {
    if(document.documentElement.clientWidth < 501) {
      this.mobileDisplay = true;
    } else {
      this.mobileDisplay = false;
    }
  }

  scrollIntoLink(): void {
    document.querySelector('.header-link.active')?.scrollIntoView();
    this.headerInit = false;
  }

  /**
   * sets the color theme of the app using css global variables
   * @param lightMode true for lightMode, false for darkMode
   * TODO set a cookie to store theme preferences
   */
  setColorTheme(lightMode: boolean): void {
    this.theme.setColorTheme(lightMode);
  }

  /**
   * sets the language used on the page
   * @param language 'en' or 'fr'
   * TODO set a cookie to store language preferences
   */
  setLanguage(language: string) {
    this.translate.use(language);
  }

  openLogin(): void {
    this.popup.openModal(LoginComponent);
  }
}
