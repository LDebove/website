import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  lightMode: boolean = false;
  showCopyright: boolean = false;

  constructor(private theme: ThemeService) { }

  ngOnInit(): void {
    this.theme.lightMode.subscribe({
      next: (lightMode: boolean) => {
        this.lightMode = lightMode;
      }
    });
  }
}
