import { AfterViewInit, Component } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { ButtonComponent } from 'src/app/shared/elements/button.component';

@Component({
  selector: 'app-terraria-pixelart',
  templateUrl: './terraria-pixelart.component.html',
  styleUrls: ['./terraria-pixelart.component.scss']
})
export class TerrariaPixelartComponent implements AfterViewInit {

  constructor(private popup: PopupService) { }
  ngAfterViewInit(): void {
    this.popup.openFeedback(ButtonComponent, { horizontalAlign: 'end', verticalAlign: 'end', autoClose: 5000, autoHide: 1000 });
  }
}
