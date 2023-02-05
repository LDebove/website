import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[preserveCanvasAspectRatio]'
})
export class PreserveCanvasAspectRatioDirective implements AfterViewInit, OnChanges {

  @Input('canvasChangeIndicator') canvasChangeIndicator: boolean = false;

  maxHeight: number = 0;

  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    this.setMaxHeight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['canvasChangeIndicator']) {
      this.setMaxHeight();
    }
  }

  @HostListener('window:resize') onResize(): void {
    this.setMaxHeight();
  }

  setMaxHeight(): void {
    let newMaxHeight = (<HTMLElement>this.element.nativeElement).parentElement!.getBoundingClientRect().height;
    if(newMaxHeight && this.maxHeight !== newMaxHeight) {
      this.maxHeight = newMaxHeight;
      (<HTMLElement>this.element.nativeElement).style.maxHeight = `${newMaxHeight}px`;
    }
  }

}
