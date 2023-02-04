import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, AfterContentChecked {
  title = 'website';
  modalOpen: boolean = false;
  feedbackOpen: boolean = false;
  feedbackHidden: boolean = false;

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;
  @ViewChild('feedbackContainer', { read: ViewContainerRef }) feedbackContainer!: ViewContainerRef;

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('feedback') feedback!: ElementRef;
  @ViewChild('feedbackOverlay') feedbackOverlay!: ElementRef;

  constructor(translate: TranslateService, private popup: PopupService, private cdr: ChangeDetectorRef) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  @HostListener('window:click') clickOutsideModal(): void {
    this.closeModal();
  }

  @HostListener('window:resize') windowResize(): void {
    if(this.feedbackHidden) {
      this.showFeedback();
    }
  }

  ngAfterViewInit(): void {
    this.popup.setModalContainer(this.modalContainer);
    this.popup.setFeedbackContainer(this.feedbackContainer);

    this.modal.nativeElement.addEventListener('click', (event: Event) => {
      event.stopPropagation();
    });

    ['mouseenter', 'touchstart'].forEach(eventType => {
      this.feedback.nativeElement.addEventListener(eventType, () => {
        if(this.feedbackHidden) {
          this.showFeedback();
        }
      });
    });

    this.popup.getModalStatus().subscribe({
      next: (status) => {
        this.modalOpen = status;
      }
    });

    this.popup.getFeedbackStatus().subscribe({
      next: (status) => {
        let observable = this.popup.getFeedbackOptions().subscribe({
          next: (options) => {
            if(options) {
              this.setFeedbackHorizontalAlign(options.horizontalAlign);
              this.setFeedbackVerticalAlign(options.verticalAlign);
            }
          },
          complete: () => {
            observable.unsubscribe();
          }
        });
        this.feedbackOpen = status;
      }
    });
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.popup.closeModal();
  }

  closeFeedback(): void {
    this.popup.closeFeedback();
  }

  setFeedbackHorizontalAlign(horizontalAlign: string): void {
    let flex = '';
    switch(horizontalAlign) {
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
    (<HTMLElement>this.feedbackOverlay.nativeElement).style.justifyContent = flex;
  }

  setFeedbackVerticalAlign(verticalAlign: string): void {
    let flex = '';
    switch(verticalAlign) {
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
    (<HTMLElement>this.feedbackOverlay.nativeElement).style.alignItems = flex;
  }

  showFeedback(): void {
    let feedbackElement = <HTMLElement>this.feedback.nativeElement;
    feedbackElement.style.removeProperty('top');
    feedbackElement.classList.remove('hidden');
    this.feedbackHidden = false;
  }

  hideFeedback(): void {
    let feedbackElement = <HTMLElement>this.feedback.nativeElement;
    let bodyRect = document.body.getBoundingClientRect();
    feedbackElement.style.top = `${bodyRect.height - 10}px`;
    feedbackElement.classList.add('hidden');
    this.feedbackHidden = true;
  }
}
