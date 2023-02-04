import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import * as light from 'src/assets/themes/light-mode.json'
import * as dark from 'src/assets/themes/dark-mode.json'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public lightMode: BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * sets the color theme of the app using css global variables
   * @param lightMode true for lightMode, false for darkMode
   * TODO set a cookie to store theme preferences
   */
  setColorTheme(lightMode: boolean): void {
    let themeSelected: any;
    if(lightMode) {
      themeSelected = light;
    } else {
      themeSelected = dark;
    }
    Object.keys(themeSelected).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, themeSelected[key]);
    });
    this.lightMode.next(lightMode);
  }
}
