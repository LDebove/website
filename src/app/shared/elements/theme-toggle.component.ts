import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cThemeToggle',
  template: `
    <label class="custom-theme-switch">
      <input type="checkbox" [(ngModel)]="checked" (change)="onChange()">
      <span class="custom-theme-slider"></span>
    </label>
  `,
  styleUrls: ['./elements.scss']
})
export class ThemeToggleComponent {
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  checked: boolean = false;

  onChange(): void {
    this.toggleChange.emit(this.checked);
  }
}
