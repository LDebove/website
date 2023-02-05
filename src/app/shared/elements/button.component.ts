import { trigger, animate, keyframes, style, transition, state } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cButton',
  template: `
    <button class="custom-button" [ngClass]="{'red': color === 'red', 'orange': color === 'orange', 'green': color === 'green'}"
    [disabled]="disabled" (click)="onClick()" [@clicked]="justClicked ? 'justClicked' : 'notClicked'" (@clicked.done)="afterAnimation()">
      <span>{{ text }}</span>
    </button>
  `,
  styleUrls: ['./elements.scss'],
  animations: [
    trigger('clicked', [
      state('notClicked', style({})),
      state('justClicked', style({})),
      transition('notClicked => justClicked', [animate(250, keyframes([
        style({ transform: 'scale(1)' }),
        style({ transform: 'scale(0.9)' }),
        style({ transform: 'scale(1)' })
      ]))]),
      transition('justClicked => notClicked', []),
    ]),
  ]
})
export class ButtonComponent {
  @Input('text') text: string = '';
  @Input('color') color: 'red' | 'orange' | 'green' | '' = '';
  @Input('disabled') disabled: boolean = false;

  @Output() cClick = new EventEmitter<void>();

  justClicked: boolean = false;

  onClick(): void {
    this.justClicked = true;
    this.cClick.emit();
  }

  afterAnimation(): void {
    this.justClicked = false;
  }

}
