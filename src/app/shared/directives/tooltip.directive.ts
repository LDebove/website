import { AfterContentInit, Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[cTooltip]'
})
export class TooltipDirective implements AfterContentInit, OnChanges {
  @Input('tooltipText') tooltipText: string = '';
  @Input('position') position: string = 'auto';

  @HostListener('mouseover') onMouseOver(): void {
    this.showTooltip();
  }

  @HostListener('mouseout') onMouseOut(): void {
    this.hideTooltip();
  }

  positionRegex = new RegExp('auto|top|right|bottom|left');
  tooltipElement: HTMLDivElement | undefined = undefined;

  constructor(private element: ElementRef) { }

  ngAfterContentInit(): void {
    this.createTooltipElement();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['position']) {
      if (!this.positionRegex.test(this.position)) {
        this.position = 'auto';
        throw new Error('Invalid tooltip position');
      } else {
        this.createTooltipElement();
      }
    }

    if (changes['tooltipText']) {
      this.createTooltipElement();
    }
  }

  createTooltipElement(): void {
    if (!this.tooltipElement) {
      this.tooltipElement = document.createElement('div');
    }
    this.tooltipElement.classList.add('custom-tooltip');
    this.tooltipElement.innerHTML = this.tooltipText;
    document.body.appendChild(this.tooltipElement);
  }

  showTooltip(): void {
    if (!this.tooltipElement) return;
    let elementRect = (<HTMLElement>this.element.nativeElement).getBoundingClientRect();
    let tooltipRect = this.tooltipElement.getBoundingClientRect();
    let x, y;
    switch (this.position) {
      case 'auto':
        let bodyRect = document.body.getBoundingClientRect();
        // top
        x = elementRect.x + elementRect.width / 2 - tooltipRect.width / 2;
        y = elementRect.y - tooltipRect.height - 5;
        if(x >= 0 && x + tooltipRect.width <= bodyRect.width && y >= 0 && y + tooltipRect.height <= bodyRect.height) break;
        // right
        x = elementRect.x + elementRect.width + 5;
        y = elementRect.y - tooltipRect.height / 2 + elementRect.height / 2;
        if(x >= 0 && x + tooltipRect.width <= bodyRect.width && y >= 0 && y + tooltipRect.height <= bodyRect.height) break;
        // bottom
        x = elementRect.x + elementRect.width / 2 - tooltipRect.width / 2;
        y = elementRect.y + elementRect.height + 5;
        if(x >= 0 && x + tooltipRect.width <= bodyRect.width && y >= 0 && y + tooltipRect.height <= bodyRect.height) break;
        //left
        x = elementRect.x - tooltipRect.width - 5;
        y = elementRect.y - tooltipRect.height / 2 + elementRect.height / 2;
        if(x >= 0 && x + tooltipRect.width <= bodyRect.width && y >= 0 && y + tooltipRect.height <= bodyRect.height) break;
        // top
        x = elementRect.x + elementRect.width / 2 - tooltipRect.width / 2;
        y = elementRect.y - tooltipRect.height - 5;
        break;

      case 'top':
        x = elementRect.x + elementRect.width / 2 - tooltipRect.width / 2;
        y = elementRect.y - tooltipRect.height - 5;

        break;

      case 'right':
        x = elementRect.x + elementRect.width + 5;
        y = elementRect.y - tooltipRect.height / 2 + elementRect.height / 2;
        break;

      case 'bottom':
        x = elementRect.x + elementRect.width / 2 - tooltipRect.width / 2;
        y = elementRect.y + elementRect.height + 5;
        break;

      case 'left':
        x = elementRect.x - tooltipRect.width - 5;
        y = elementRect.y - tooltipRect.height / 2 + elementRect.height / 2;
        break;

      default:
        break;
    }
    this.tooltipElement.style.left = `${x}px`;
    this.tooltipElement.style.top = `${y}px`;
    this.tooltipElement.style.visibility = 'visible';
  }

  hideTooltip(): void {
    if (!this.tooltipElement) return;
    this.tooltipElement.style.visibility = 'hidden';
  }

}
