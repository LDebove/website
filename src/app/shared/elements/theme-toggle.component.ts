import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'cThemeToggle',
  template: `
    <label class="custom-theme-switch">
      <input type="checkbox" [(ngModel)]="checked" (change)="onChange()">
      <span class="theme-slider"></span>
    </label>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-theme-switch {
      --night-color: #000000;
      --day-color: #000000;
      --color: #fff000;
      --size-multiplier: 0.6;

      font-size: 17px;
      position: relative;
      display: inline-block;
      width: calc(var(--size-multiplier) * 3.5em);
      height: calc(var(--size-multiplier) * 2em);

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .theme-slider {
          background-color: var(--day-color);
        }

        &:checked + .theme-slider:before {
          transform: translateX(100%);
          box-shadow: inset 15px -4px 0px 15px var(--color);
        }
      }

      .theme-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--night-color);
        transition: .5s;
        border-radius: 30px;

        &:before {
          position: absolute;
          content: "";
          width: calc(var(--size-multiplier) * 1.4em);
          height: calc(var(--size-multiplier) * 1.4em);
          border-radius: 50%;
          left: 10%;
          bottom: 15%;
          box-shadow: inset calc(var(--size-multiplier) * 8px) calc(var(--size-multiplier) * -4px) 0px 0px var(--color);
          background: var(--night-color);
          transition: .5s;
        }
      }
    }
  `]
})
export class ThemeToggleComponent {
  @Input('checked') checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(): void {
    this.checkedChange.emit(this.checked);
  }
}
