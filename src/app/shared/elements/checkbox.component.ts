import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cCheckbox',
  template: `
    <div class="custom-checkbox-container">
      <input class="checkbox" [formControl]="input" type="checkbox" (change)="onChange()">
      <label *ngIf="label !== ''" class="checkbox-label">
        <span (click)="onClick()">{{ label }}</span>
      </label>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-checkbox-container {
      display: flex;
      width: 100%;
      gap: 5px;

      .checkbox {
        display: block;
        width: 25px;
        height: 25px;
        border-radius: 5px;
        margin: 0;
        border: 0;
        outline: 0;
        accent-color: var(--color-5);
        cursor: pointer;
        flex: 0 0 25px;

        &:checked {
          animation: check 0.5s;
        }
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        overflow: hidden;

        span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      @keyframes check {
        0% { transform: scale(1); }
        50% { transform: scale(0.9); }
        100% { transform: scale(1); }
      }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  @Input('label') label: string = '';
  @Input('checked') checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  //#region ControlValueAccessor
  input = new FormControl(false);
  _onTouched = () => {};
  //#endregion

  ngAfterViewInit(): void {
    this.input.patchValue(this.checked);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['checked']) {
      this.input.patchValue(this.checked);
    }
  }

  onClick(): void {
    this.checked = !this.checked;
    this.input.patchValue(this.checked);
    this.checkedChange.emit(this.checked);
  }

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
