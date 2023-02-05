import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cCheckbox',
  template: `
    <div class="custom-checkbox-container">
      <input class="checkbox" [formControl]="input" type="checkbox" (change)="onChange()">
      <label *ngIf="label !== ''" class="checkbox-label">
        <span>{{ label }}</span>
      </label>
    </div>
  `,
  styleUrls: ['./elements.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input('label') label: string = '';
  @Input('checked') checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  //#region ControlValueAccessor
  input = new FormControl('');
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
