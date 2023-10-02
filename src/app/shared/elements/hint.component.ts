import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'cHint',
  template: `
    <div class="custom-hint" cTooltip [tooltipText]="text" #hintElement>?<div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-hint {
      display: flex;
      width: 15px;
      height: 15px;
      font-size: 12px;
      font-weight: bold;
      border-radius: 50%;
      border: 1px solid var(--highlight-color-1);
      box-sizing: border-box;
      cursor: help;
      color: #FFFFFF;
      background-color: var(--color-5);
      justify-content: center;
      align-items: center;
      user-select: none;

      &:hover {
        border: 1px solid var(--highlight-color-2);
      }
    }
  `]
})
export class HintComponent {
  @Input('text') text: string = '';
  @ViewChild('hintElement') hintElement?: ElementRef;

  // allows mobile support
  tooltipVisible: boolean = false;


  // allows mobile support
  @HostListener('touchstart', ['$event']) onTouchStart(event: Event): void {
    event.stopPropagation();
    this.tooltipVisible = true;
    (<HTMLElement>this.hintElement?.nativeElement).dispatchEvent(new Event('mouseover'));
  }

  // allows mobile support
  @HostListener('window:touchstart') onWindowTouchStart(): void {
    this.tooltipVisible = false;
    (<HTMLElement>this.hintElement?.nativeElement).dispatchEvent(new Event('mouseout'));
  }

}
