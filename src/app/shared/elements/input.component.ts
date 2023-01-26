import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'cInput',
  template: `
    <div class="custom-input-group" [ngClass]="{'hidden': type === 'hidden'}">
      <div class="custom-input-label-group">
        <label *ngIf="label !== ''" class="custom-input-label" #labelElement>
          {{ label }}
        </label>
        <span *ngIf="required" class="custom-input-required">&nbsp;*</span>
      </div>
      <input class="custom-input"
      [type]="type" [disabled]="disabled" [value]="value" [placeholder]="placeholder"
      [min]="min !== undefined ? min : ''" [max]="max !== undefined ? max : ''" [pattern]="pattern ? pattern : '.*'"
      [accept]="accept"
      (input)="onInput($event)" (change)="onChange($event)"/>
    </div>
  `,
  styleUrls: ['./elements.scss'],
})
export class InputComponent implements AfterViewInit, OnChanges {
  @Input('type') type: string = 'text';
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

  @Output() valueInput = new EventEmitter<Event>();
  @Output() valueChange = new EventEmitter<Event>();

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

  onInput(event: Event): void {
    if(this.active) {
      this.valueInput.emit(event);
    }
  }

  onChange(event: Event): void {
    if(this.active) {
      this.valueChange.emit(event);
    }
  }
}
