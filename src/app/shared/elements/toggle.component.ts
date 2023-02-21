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
  styleUrls: ['./elements.scss'],
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
