import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cToggle',
  template: `
    <label class="custom-switch">
      <input type="checkbox" [(ngModel)]="checked" (change)="onChange()">
      <span class="slider"></span>
    </label>
  `,
  styleUrls: ['./elements.scss']
})
export class ToggleComponent {
  @Output() checkedChange = new EventEmitter<boolean>();
  @Input('checked') checked: boolean = false;

  onChange(): void {
    this.checkedChange.emit(this.checked);
  }
}
