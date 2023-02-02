import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

export interface IFeedbackOptions {
  horizontalAlign: 'start' | 'center' | 'end';
  verticalAlign: 'start' | 'end';
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private modalContainer!: ViewContainerRef;
  private feedbackContainer!: ViewContainerRef;
  private modalOpen: Subject<boolean> = new Subject<boolean>();
  private feedbackOpen: Subject<boolean> = new Subject<boolean>();
  private feedbackOptions: Subject<IFeedbackOptions | undefined> = new Subject<IFeedbackOptions | undefined>();

  constructor() {
    this.modalOpen.next(false);
    this.feedbackOpen.next(false);
  }

  setModalContainer(modalContainer: ViewContainerRef): void {
    this.modalContainer = modalContainer;
  }

  setFeedbackContainer(feedbackContainer: ViewContainerRef): void {
    this.feedbackContainer = feedbackContainer;
  }

  openModal(componentType: Type<unknown>): void {
    this.modalOpen.next(true);
    this.modalContainer.clear();
    this.modalContainer.createComponent(componentType);
  }

  openFeedback(componentType: Type<unknown>, options?: IFeedbackOptions): void {
    this.feedbackOpen.next(true);
    this.feedbackOptions.next(options);
    this.feedbackContainer.clear();
    this.feedbackContainer.createComponent(componentType);
  }

  closeModal(): void {
    this.modalOpen.next(false);
    this.modalContainer.clear();
  }

  closeFeedback(): void {
    this.feedbackOpen.next(false);
    this.feedbackContainer.clear();
  }

  getModalStatus(): Observable<boolean> {
    return this.modalOpen.asObservable();
  }

  getFeedbackStatus(): Observable<boolean> {
    return this.feedbackOpen.asObservable();
  }

  getFeedbackOptions(): Observable<IFeedbackOptions | undefined> {
    return this.feedbackOptions.asObservable();
  }

}
