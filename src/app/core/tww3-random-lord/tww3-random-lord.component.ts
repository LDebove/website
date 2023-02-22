import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Lord, Race } from 'src/app/models/lord.model';
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
  mappedRaces: { race: Race, mappedLords: {lord: Lord, selected: boolean}[] }[] = [];
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
            this.orderLordsByRaces(response.data.lords.map((lord: Lord) => ({ lord: lord, selected: true })));
          } else {
            this.orderLordsByRaces(response.data.lords.map((lord: Lord) => ({ lord: lord, selected: !lord.done })));
            this.api.get('lords/doing').subscribe({
              next: (response) => {
                if(response.data?.lordId) {
                  for(let i = 0; i < this.mappedRaces.length; i++) {
                    let lordFound = this.mappedRaces[i].mappedLords.find(mappedLord => mappedLord.lord.id === response.data.lordId)?.lord;
                    if(lordFound) {
                      this.lord = lordFound;
                      break;
                    }
                  }
                }
              }
            });
          }
        }
      }
    });
  }

  orderLordsByRaces(mappedLords: {lord: Lord, selected: boolean}[]): void {
    mappedLords.forEach((mappedLord) => {
      let mappedRaceIndex = this.mappedRaces.findIndex(mappedRace => mappedRace.race.id === mappedLord.lord.race.id);
      if(mappedRaceIndex === -1) {
        this.mappedRaces.push({ race: mappedLord.lord.race, mappedLords: [ mappedLord ]});
      } else {
        this.mappedRaces[mappedRaceIndex].mappedLords.push(mappedLord);
      }
    });
  }

  handleLordSelection(mappedLord: {lord: Lord, selected: boolean}, checked: boolean): void {
    let mappedRaceIndex = this.mappedRaces.findIndex(mappedRace => mappedRace.race.id === mappedLord.lord.race.id);
    if(mappedRaceIndex !== -1) {
      let mappedLordIndex = this.mappedRaces[mappedRaceIndex].mappedLords.findIndex(_mappedLord => _mappedLord.lord.id === mappedLord.lord.id);
      if(mappedLordIndex !== -1) {
        this.mappedRaces[mappedRaceIndex].mappedLords[mappedLordIndex].selected = checked;
      }
    }
  }

  handleRaceSelection(raceId: number): void {
    let mappedRaceIndex = this.mappedRaces.findIndex(mappedRace => mappedRace.race.id === raceId);
    if(mappedRaceIndex !== -1) {
      let mappedLordIndex = this.mappedRaces[mappedRaceIndex].mappedLords.findIndex(mappedLord => mappedLord.selected === false);
      if(mappedLordIndex === -1) {
        this.mappedRaces[mappedRaceIndex].mappedLords.forEach((mappedLord) => {
          mappedLord.selected = false;
        });
      } else {
        this.mappedRaces[mappedRaceIndex].mappedLords.forEach((mappedLord) => {
          mappedLord.selected = true;
        });
      }
    }
  }

  handleAllLordsSelection(): void {
    let mappedLordIndex: number = -1;
    for(let i = 0; i < this.mappedRaces.length; i++) {
      mappedLordIndex = this.mappedRaces[i].mappedLords.findIndex(mappedLord => mappedLord.selected === false);
      if(mappedLordIndex !== -1) break;
    }
    if(mappedLordIndex === -1) {
      this.mappedRaces.forEach((mappedRace) => {
        mappedRace.mappedLords.forEach((mappedLord) => {
          mappedLord.selected = false;
        });
      });
    } else {
      this.mappedRaces.forEach((mappedRace) => {
        mappedRace.mappedLords.forEach((mappedLord) => {
          mappedLord.selected = true;
        });
      });
    }
  }

  randomize(): void {
    let mappedLords: {lord: Lord, selected: boolean}[] = [];
    this.mappedRaces.forEach((mappedRace) => {
      mappedRace.mappedLords.forEach((mappedLord) => {
        mappedLords.push(mappedLord);
      });
    });
    let lords = mappedLords.filter(mappedLord => mappedLord.selected !== false);
    if(lords.length !== 0) {
      this.lord = lords[Math.floor(Math.random() * lords.length)].lord;
    }
  }

  markAsDone(): void {
    if(!this.lord || !this.authenticated) return;
    this.api.put('lords/done', null).subscribe();
    let mappedRaceIndex = this.mappedRaces.findIndex((mappedRace) => mappedRace.race.id === this.lord!.race.id);
    if(mappedRaceIndex !== -1) {
      let mappedLordIndex = this.mappedRaces[mappedRaceIndex].mappedLords.findIndex(mappedLord => mappedLord.lord.id === this.lord!.id);
      if(mappedLordIndex !== -1) {
        this.mappedRaces[mappedRaceIndex].mappedLords[mappedLordIndex].selected = false;
      }
    }
    this.randomize();
    this.api.put('lords/doing', { id: this.lord.id }).subscribe();
  }
}
