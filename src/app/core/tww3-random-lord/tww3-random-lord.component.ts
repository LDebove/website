import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Lord } from 'src/app/models/lord.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { PopupService } from 'src/app/services/popup.service';
import { environment } from 'src/environments/environment';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';

@Component({
  selector: 'app-tww3-random-lord',
  templateUrl: './tww3-random-lord.component.html',
  styleUrls: ['./tww3-random-lord.component.scss']
})
export class Tww3RandomLordComponent implements OnInit, AfterViewInit {

  serverRoot: string = environment.serverRoot;
  mappedLords: {lord: Lord, selected: boolean}[] = [];
  lord?: Lord;
  authenticated: boolean = false;


  constructor(private title: Title, private translate: TranslateService, private api: ApiService, private auth: AuthService, private popup: PopupService) { }

  ngOnInit(): void {
    this.authenticated = this.auth.getAuthenticated();
    this.getLords();
    this.auth.authenticatedSubject.subscribe({
      next: (authenticated) => {
        this.authenticated = authenticated;
        this.getLords();
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
    this.popup.openFeedback(DisclaimerComponent, { horizontalAlign: 'end', verticalAlign:'end', autoHide: 2000, autoClose: 5000 });
  }

  getLords(): void {
    this.api.get('lords').subscribe({
      next: (response) => {
        if(response.data?.lords) {
          if(!this.authenticated) {
            this.mappedLords = response.data.lords.map((lord: Lord) => ({ lord: lord, selected: true }));
          } else {
            this.mappedLords = response.data.lords.map((lord: Lord) => ({ lord: lord, selected: !lord.done }));
            this.api.get('lords/doing').subscribe({
              next: (response) => {
                if(response.data?.lordId) {
                  this.lord = this.mappedLords.find(mappedLord => mappedLord.lord.id === response.data.lordId)?.lord;
                }
              }
            });
          }
        }
      }
    });
  }

  handleLordSelection(mappedLord: {lord: Lord, selected: boolean}, selected: boolean): void {
    let foundMappedLord = this.mappedLords.find(_mappedLord => _mappedLord.lord.id === mappedLord.lord.id);
    if(foundMappedLord) {
      foundMappedLord.selected = !selected;
    }
  }

  randomize(): void {
    let lords = this.mappedLords.filter(mappedLord => mappedLord.selected !== false);
    this.lord = lords[Math.floor(Math.random() * lords.length)].lord;
  }

  markAsDone(): void {
    if(!this.lord || !this.authenticated) return;
    this.api.put('lords/done', null).subscribe();
    let foundMappedLord = this.mappedLords.find(mappedLord => mappedLord.lord.id === this.lord!.id);
    if(foundMappedLord) {
      foundMappedLord.selected = false;
    }
    this.randomize();
    this.api.put('lords/doing', { id: this.lord.id }).subscribe();
  }
}
