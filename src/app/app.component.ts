import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserAgentService } from './services/user-agent.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'website';


  constructor(translate: TranslateService, private ua: UserAgentService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    if(this.ua.isMobile()) {
      document.body.classList.add('mobile');
    }
  }
}
