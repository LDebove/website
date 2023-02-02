import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'cFeedback',
  template: `
    <div class="custom-feedback-overlay" #feedbackOverlay>
      <div class="feedback-container">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./elements.scss'],
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
    }
  `]
})
export class FeedbackComponent implements AfterViewInit, OnChanges {
  @Input('horizontal') horizontal: string = 'center';
  @Input('vertical') vertical: string = 'end';

  @ViewChild('feedbackOverlay') overlay: ElementRef = {} as ElementRef;

  allowedPositions: RegExp = new RegExp('start|center|end');

  constructor() { }

  ngAfterViewInit(): void {
    this.horizontalAlign();
    this.verticalAlign();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['horizontal']) {
      this.horizontalAlign();
    } else if(changes['vertical']) {
      this.verticalAlign();
    }
  }

  horizontalAlign(): void {
    if(!this.allowedPositions.test(this.horizontal)) {
      throw new Error(`Wrong horizontal position value, reading \"${this.horizontal}\"`);
    } else {
      let flex = '';
      switch(this.horizontal) {
        case 'start':
          flex = 'flex-start';
          break;
        case 'end':
          flex = 'flex-end';
          break;
        case 'center':
        default:
          flex = 'center';
          break;
      }
      (<HTMLElement>this.overlay.nativeElement).style.justifyContent = flex;
    }
  }

  verticalAlign(): void {
    if(!this.allowedPositions.test(this.horizontal)) {
      throw new Error(`Wrong vertical position value, reading \"${this.vertical}\"`);
    } else {
      let flex = '';
      switch(this.vertical) {
        case 'start':
          flex = 'flex-start';
          break;
        case 'end':
          flex = 'flex-end';
          break;
        case 'center':
        default:
          flex = 'center';
          break;
      }
      (<HTMLElement>this.overlay.nativeElement).style.alignItems = flex;
    }
  }
}
