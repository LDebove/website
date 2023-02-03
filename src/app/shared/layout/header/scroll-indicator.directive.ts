import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[scrollIndicator]'
})
export class ScrollIndicatorDirective implements AfterViewInit {

  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    this.addScrollIndicators();
  }

  @HostListener('scroll') onScroll(): void {
    this.addScrollIndicators();

  }

  @HostListener('window:resize') onResize(): void {
    this.addScrollIndicators();
  }

  addScrollIndicators(): void {
    let scrollLeft = this.element.nativeElement.scrollLeft;
    let maxScroll = this.element.nativeElement.scrollWidth - this.element.nativeElement.clientWidth;
    if(maxScroll === 0) {
      this.element.nativeElement.classList.remove('left');
      this.element.nativeElement.classList.remove('right');
    } else if(scrollLeft === 0) {
      this.element.nativeElement.classList.remove('right');
      this.element.nativeElement.classList.add('left');
    } else if(scrollLeft === maxScroll) {
      this.element.nativeElement.classList.remove('left');
      this.element.nativeElement.classList.add('right');
    } else {
      this.element.nativeElement.classList.add('left');
      this.element.nativeElement.classList.add('right');
    }
  }

}
