import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cCheckbox',
  template: `
    <div class="custom-checkbox-container">
      <input class="custom-checkbox" type="checkbox" [(ngModel)]="checked" (change)="onChange()">
      <label *ngIf="label !== ''" class="custom-checkbox-label">
        <span>{{ label }}</span>
      </label>
    </div>
  `,
  styleUrls: ['./elements.scss'],
})
export class CheckboxComponent {
  @Input('label') label: string = '';
  @Input('checked') checked: boolean = false;

  @Output() checkChange = new EventEmitter<boolean>();

  onChange(): void {
    this.checkChange.emit(this.checked);
  }
}
