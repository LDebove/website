import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';

@Directive({
  selector: '[feedbackAction]'
})
export class FeedbackActionDirective implements AfterViewInit {

  @Input('feedbackAction') feedbackAction: 'close' | 'action1' | 'action2' = 'close';

  constructor(private element: ElementRef, private popup: PopupService) { }

  ngAfterViewInit(): void {
    ['click', 'touchend'].forEach(eventType => {
      this.element.nativeElement.addEventListener(eventType, () => {
        if(this.feedbackAction === 'close') {
          this.popup.closeFeedback();
        } else if(this.feedbackAction === 'action1') {
          this.popup.feedbackAction1.next();
        } else if(this.feedbackAction === 'action2') {
          this.popup.feedbackAction2.next();
        }
      });
    });
  }

}
