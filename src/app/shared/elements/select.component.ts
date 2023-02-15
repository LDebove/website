import { Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Output, QueryList, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionComponent } from './option.component';

@Component({
  selector: 'cSelect',
  template: `
    <div class="custom-select">
      <select [formControl]="control" #select (change)="onChange()">
        <ng-content></ng-content>
      </select>
    </div>
  `,
  styleUrls: ['./elements.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('select') select?: ElementRef;

  @ContentChildren(OptionComponent) optionComponents?: QueryList<OptionComponent>;

  //#region ControlValueAccessor
  control = new FormControl('');
  _onTouched = () => {};
  //#endregion

  onChange(): void {
    let selectedOption = (<HTMLSelectElement>this.select?.nativeElement).selectedOptions[0];
    let optionValue: any = undefined;
    this.optionComponents?.toArray().forEach((optionComponent) => {
      if(optionComponent.option === selectedOption) {
        optionValue = optionComponent.value;
      }
    });
    this.selectionChange.emit(optionValue);
  }

  //#region ControlValueAccessor
  writeValue(obj: any): void {
    if(obj) {
      this.control.patchValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
  //#endregion
}
