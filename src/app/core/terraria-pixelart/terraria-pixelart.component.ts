import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-terraria-pixelart',
  templateUrl: './terraria-pixelart.component.html',
  styleUrls: ['./terraria-pixelart.component.scss']
})
export class TerrariaPixelartComponent implements AfterViewInit {

  group = new FormGroup({
    input: new FormControl('')
  });

  constructor() { }

  ngAfterViewInit(): void {
  }

}
