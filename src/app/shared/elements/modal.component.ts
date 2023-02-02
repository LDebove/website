import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'cModal',
  template: `
    <div class="custom-modal-overlay">
      <div class="modal-container" #modalContainer>
        <button class="close-button" (click)="close.emit()">X</button>
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
export class ModalComponent implements AfterViewInit {
  @ViewChild('modalContainer') modal: ElementRef = {} as ElementRef;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('window:click') clickOutside() {
    this.close.emit();
  }

  ngAfterViewInit(): void {
    this.modal.nativeElement.addEventListener('click', (event: Event) => {
      event.stopPropagation();
    });
  }
}
