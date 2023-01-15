import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'cInput',
  template: `
    <div class="custom-input-group" [ngClass]="{'hidden': type === 'hidden'}">
      <div class="custom-input-label-group">
        <label *ngIf="label !== ''" class="custom-input-label" #label>
          {{ label }}
        </label>
        <span *ngIf="required" class="custom-input-required">&nbsp;*</span>
      </div>
      <input class="custom-input"
      [type]="type" [disabled]="disabled" [value]="value" [placeholder]="placeholder"
      [min]="min ? min : ''" [max]="max ? max : ''" [pattern]="pattern ? pattern : '.*'"
      [accept]="accept"
      (input)="onInput($event.target!)" (change)="onChange($event.target!)"/>
    </div>
  `,
  styleUrls: ['./elements.scss'],
})
export class InputComponent implements AfterViewInit, OnChanges {
  @Input('type') type: string = 'text';
  @Input('disabled') disabled: boolean = false;
  @Input('required') required: boolean = false;
  @Input('pattern') pattern: string | null = null;
  @Input('value') value: string = '';
  @Input('placeholder') placeholder: string = '';
  @Input('min') min: number | null = null;
  @Input('max') max: number | null = null;
  @Input('accept') accept: string = '';
  @Input('label') label: string = '';

  @Output() valueInput = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  allowedInputTypes = new RegExp('color|date|datetime-local|email|file|hidden|month|number|password|range|tel|text|time|url');

  constructor(private element: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['type']) {
      if(this.type === 'hidden') {
        this.element.nativeElement.classList.add('hidden');
      } else {
        this.element.nativeElement.classList.remove('hidden');
      }
    }
  }

  ngAfterViewInit(): void {
    if(!this.allowedInputTypes.test(this.type)) {
      throw new Error(`Input type cannot be ${this.type}`);
    }
  }

  onInput(eventTarget: EventTarget): void {
    let inputValue = (<HTMLInputElement>eventTarget).value;
    this.valueInput.emit(inputValue);
  }

  onChange(eventTarget: EventTarget): void {
    let inputValue = (<HTMLInputElement>eventTarget).value;
    this.valueChange.emit(inputValue);
  }
}
