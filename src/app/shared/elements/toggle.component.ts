import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cToggle',
  template: `
    <label class="custom-switch">
      <input type="checkbox" [(ngModel)]="checked" (change)="onChange()">
      <span class="custom-slider"></span>
    </label>
  `,
  styleUrls: ['./elements.scss']
})
export class ToggleComponent {
  @Output() toggleChange = new EventEmitter<boolean>();
  @Input('checked') checked: boolean = false;

  onChange(): void {
    this.toggleChange.emit(this.checked);
  }
}
