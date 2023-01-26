import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'cDialog',
  template: `
    <div class="custom-dialog-overlay" #dialog>
    </div>
  `,
  styleUrls: ['./elements.scss'],
})
export class DialogComponent {
  @ViewChild('dialog') dialogElement: ElementRef = {} as ElementRef;

  openDialog(): void {
    document.body.appendChild(this.dialogElement.nativeElement);
  }
}
