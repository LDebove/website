import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ThemeService } from 'src/app/services/theme.service';
import { LicenseComponent } from '../license/license.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  lightMode: boolean = false;

  constructor(private theme: ThemeService, private popup: PopupService) { }

  ngOnInit(): void {
    this.theme.lightMode.subscribe({
      next: (lightMode: boolean) => {
        this.lightMode = lightMode;
      }
    });
  }

  openCopyright(): void {
    this.popup.openModal(LicenseComponent)
  }
}
