import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'cInput',
  template: `
    <div class="custom-input-group" [ngClass]="{'hidden': type === 'hidden'}">
      <div class="input-label-group">
        <label *ngIf="label !== ''" class="input-label" #labelElement>
          {{ label }}
        </label>
        <span *ngIf="required" class="input-required">&nbsp;*</span>
      </div>
      <input class="input"
      [type]="type" [disabled]="disabled" [value]="value" [placeholder]="placeholder"
      [min]="min !== undefined ? min : ''" [max]="max !== undefined ? max : ''" [pattern]="pattern ? pattern : '.*'"
      [accept]="accept"
      (input)="onInput($event)" (change)="onChange($event)"/>
    </div>
  `,
  styleUrls: ['./elements.scss'],
})
export class InputComponent implements OnChanges {
  @Input('type') type: 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'month' | 'number' | 'password' | 'range' | 'tel' | 'text' | 'time' | 'url' = 'text';
  @Input('disabled') disabled: boolean = false;
  @Input('required') required: boolean = false;
  @Input('active') active: boolean = true;
  @Input('pattern') pattern: string | undefined = undefined;
  @Input('value') value: any = '';
  @Input('placeholder') placeholder: string = '';
  @Input('min') min: number | undefined = undefined;
  @Input('max') max: number | undefined = undefined;
  @Input('accept') accept: string = '';
  @Input('label') label: string = '';

  @Output() cInput = new EventEmitter<Event>();
  @Output() cChange = new EventEmitter<Event>();

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
}
