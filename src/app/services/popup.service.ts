import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

export interface IFeedbackOptions {
  horizontalAlign: 'start' | 'center' | 'end';
  verticalAlign: 'start' | 'end';
  autoClose?: number;
  autoHide?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private modalContainer?: ViewContainerRef;
  private feedbackContainer?: ViewContainerRef;
  private modalOpen: Subject<boolean> = new Subject<boolean>();
  private feedbackOpen: Subject<boolean> = new Subject<boolean>();
  private feedbackOptions: Subject<IFeedbackOptions | undefined> = new Subject<IFeedbackOptions | undefined>();
  public feedbackClose: Subject<void> = new Subject<void>();
  public feedbackAction1: Subject<void> = new Subject<void>();
  public feedbackAction2: Subject<void> = new Subject<void>();

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
    this.modalContainer!.clear();
    this.modalContainer!.createComponent(componentType);
  }

  openFeedback(componentType: Type<unknown>, options?: IFeedbackOptions): void {
    this.feedbackOpen.next(true);
    this.feedbackOptions.next(options);
    this.feedbackContainer!.clear();
    this.feedbackContainer!.createComponent(componentType);
  }

  closeModal(): void {
    this.modalOpen.next(false);
    this.modalContainer!.clear();
  }

  closeFeedback(): void {
    this.feedbackClose.next();
    this.feedbackOpen.next(false);
    this.feedbackContainer!.clear();
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

  onFeedbackClose(): Observable<void> {
    return this.feedbackClose.asObservable();
  }

  onFeedbackAction1(): Observable<void> {
    return this.feedbackAction1.asObservable();
  }

  onFeedbackAction2(): Observable<void> {
    return this.feedbackAction2.asObservable();
  }


}
