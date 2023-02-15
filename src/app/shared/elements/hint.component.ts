import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'cHint',
  template: `
    <div class="custom-hint" cTooltip [tooltipText]="text" #hintElement>?<div>
  `,
  styleUrls: ['./elements.scss'],
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
