import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cThemeToggle',
  template: `
    <label class="custom-theme-switch">
      <input type="checkbox" [(ngModel)]="checked" (change)="onChange()">
      <span class="theme-slider"></span>
    </label>
  `,
  styleUrls: ['./elements.scss']
})
export class ThemeToggleComponent {
  @Input('checked') checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(): void {
    this.checkedChange.emit(this.checked);
  }
}
