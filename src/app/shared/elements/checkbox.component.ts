import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cCheckbox',
  template: `
    <div class="custom-checkbox-container">
      <input class="checkbox" type="checkbox" [(ngModel)]="checked" (change)="onChange()">
      <label *ngIf="label !== ''" class="checkbox-label">
        <span>{{ label }}</span>
      </label>
    </div>
  `,
  styleUrls: ['./elements.scss'],
})
export class CheckboxComponent {
  @Input('label') label: string = '';
  @Input('checked') checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(): void {
    this.checkedChange.emit(this.checked);
  }
}
