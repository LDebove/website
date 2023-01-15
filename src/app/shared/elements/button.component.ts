import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cButton',
  template: `
    <button class="custom-button" [ngClass]="{'red': color === 'red', 'orange': color === 'orange', 'green': color === 'green'}"
    (click)="onClick()">
      <span>{{ text }}</span>
    </button>
  `,
  styleUrls: ['./elements.scss'],
})
export class ButtonComponent implements AfterViewInit {
  @Input('text') text: string = '';
  @Input('color') color: string = '';

  @Output() buttonClick = new EventEmitter<void>();

  allowedColors = new RegExp('red|orange|green');

  ngAfterViewInit(): void {
    if(this.color !== '' && !this.allowedColors.test(this.color)) {
      throw new Error(`checkbox does not support ${this.color} color`);
    }
  }

  onClick(): void {
    this.buttonClick.emit();
  }

}
