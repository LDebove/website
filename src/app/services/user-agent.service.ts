import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAgentService {
  mobileUserAgentRegex: RegExp = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS');

  constructor() { }

  isMobile(): boolean {
    if(this.mobileUserAgentRegex.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }

}
