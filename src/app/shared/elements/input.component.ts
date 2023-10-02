import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

@Component({
  selector: 'cInput',
  template: `
    <div class="custom-input-group" [ngClass]="{'hidden': type === 'hidden'}">
      <div class="input-label-group">
        <label *ngIf="label !== ''" class="input-label" #labelElement>
          {{ label }}
        </label>
        <span *ngIf="isRequired()" class="input-required">&nbsp;*</span>
      </div>
      <input class="input" [formControl]="input" [type]="type"
      [placeholder]="placeholder" [accept]="accept"
      (input)="onInput($event)" (change)="onChange($event)" (keyup.enter)="onSubmit($event)"/>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-input-group {
      display: inline-flex;
      flex-direction: column;
      width: inherit;

      .input-label-group {
        display: flex;
        width: 100%;
        white-space: nowrap;
        font-weight: bold;
        font-size: 15px;

        .input-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .input-required {
          flex-shrink: 0;
          color: var(--important-color);
        }
      }

      .input {
        width: 100%;
        min-width: 50px;
        padding: 2px 5px;
        border-radius: 5px;
        border: 1px solid var(--highlight-color-1);
        box-sizing: border-box;
        outline: 0;
        background-color: var(--contrast-color);
        color: var(--font-color);

        &::placeholder {
          color: var(--tinted-color);
        }

        &:focus,
        &:hover {
          border: 1px solid var(--highlight-color-2);
        }

        &:disabled {
          color: var(--tinted-color);
          cursor: not-allowed;
        }

        &:invalid {
          border: 1px solid var(--error-color);
        }

        &:not(:disabled)[type="color"] {
          cursor: pointer;
        }
      }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements OnChanges, ControlValueAccessor {
  @Input('type') type: 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'month' | 'number' | 'password' | 'range' | 'tel' | 'text' | 'time' | 'url' = 'text';
  @Input('label') label: string = '';
  @Input('placeholder') placeholder: string = '';
  @Input('accept') accept: string = '';
  @Input('active') active: boolean = true;

  @Output() cInput = new EventEmitter<Event>();
  @Output() cChange = new EventEmitter<Event>();
  @Output() cSubmit = new EventEmitter<Event>();

  //#region ControlValueAccessor
  input = new FormControl('');
  _onTouched = () => {};
  //#endregion

  constructor(private element: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['type']) {
      if(this.type === 'hidden') {
        (<HTMLElement>this.element.nativeElement).style.display = 'none';
      } else {
        (<HTMLElement>this.element.nativeElement).style.removeProperty('display');
      }
    }
  }

  isRequired(): boolean {
    return this.input.hasValidator(Validators.required);
  }

  onInput(event: Event): void {
    if(this.active) {
      this.cInput.emit(event);
    }
  }

  onChange(event: Event): void {
    if(this.active) {
      this.cChange.emit(event);
    }
  }

  onSubmit(event: Event): void {
    this.cSubmit.emit(event);
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
