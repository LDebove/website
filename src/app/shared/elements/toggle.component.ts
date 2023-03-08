import { Component, Output, EventEmitter, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cToggle',
  template: `
    <label class="custom-switch">
      <input [formControl]="input" type="checkbox" (change)="onChange()">
      <span class="slider"></span>
    </label>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-switch {
      font-size: 12px;
      position: relative;
      display: inline-block;
      width: 3.5em;
      height: 2em;

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .slider {
          background-color: var(--color-5);
        }

        &:checked + .slider:before {
          transform: translateX(1.5em);
        }
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 30px;

        &:before {
          position: absolute;
          content: "";
          height: 1.4em;
          width: 1.4em;
          border-radius: 20px;
          left: 0.3em;
          bottom: 0.3em;
          background-color: white;
          transition: .4s;
        }
      }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ]
})
export class ToggleComponent implements ControlValueAccessor {
  @Output() checkedChange = new EventEmitter<boolean>();
  @Input('checked') checked: boolean = false;

  //#region ControlValueAccessor
  input = new FormControl(false);
  _onTouched = () => {};
  //#endregion

  onChange(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

  //#region ControlValueAccessor
  writeValue(obj: any): void {
    if(obj) {
      this.input.patchValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.input.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.input.disable() : this.input.enable();
  }
  //#endregion
}
