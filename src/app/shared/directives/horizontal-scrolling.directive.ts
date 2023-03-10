import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[horizontalScrolling]'
})
export class HorizontalScrollingDirective {

  @HostListener('wheel', ['$event']) onScroll(event: WheelEvent) {
    (<Element>event.currentTarget).scrollLeft += event.deltaY;
    event.preventDefault();
  }
}
