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
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-button {
      display: flex;
      width: inherit;
      height: inherit;
      min-height: 25px;
      padding: 0 5px;
      border: 1px solid var(--highlight-color-1);
      margin: 0;
      box-sizing: border-box;
      border-radius: 5px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background-color: var(--contrast-color);
      color: var(--font-color);
      text-transform: uppercase;
      font-weight: bold;
      font-size: inherit;

      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &:hover {
        border: 1px solid var(--highlight-color-2);
      }

      &:disabled {
        color: var(--tinted-color);
        cursor: not-allowed;
      }

      &.green {
        border: 1px solid #00D419;
        background-color: #24BF36;
        color: #FFFFFF;
      }
      &.orange {
        border: 1px solid #FF7110;
        background-color: #EA7C33;
        color: #FFFFFF;
      }
      &.red {
        border: 1px solid #FF1616;
        background-color: #CC3030;
        color: #FFFFFF;
      }
    }
  `],
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
