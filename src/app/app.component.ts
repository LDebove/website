import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'website';
  modalOpen: boolean = false;
  feedbackOpen: boolean = false;

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;
  @ViewChild('feedbackContainer', { read: ViewContainerRef }) feedbackContainer!: ViewContainerRef;

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('feedbackOverlay') feedbackOverlay!: ElementRef;

  constructor(translate: TranslateService, private popup: PopupService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  @HostListener('window:click') clickOutsideModal() {
    this.closeModal();
  }

  ngAfterViewInit(): void {
    this.popup.setModalContainer(this.modalContainer);
    this.popup.setFeedbackContainer(this.feedbackContainer);

    this.modal.nativeElement.addEventListener('click', (event: Event) => {
      event.stopPropagation();
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
}
