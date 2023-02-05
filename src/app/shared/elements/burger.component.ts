import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'cBurger',
  template: `
    <label for="custom-burger" class="custom-burger">
      <input id="custom-burger" type="checkbox" [(ngModel)]="checked" #checkbox>
      <span></span>
      <span></span>
      <span></span>
    </label>
  `,
  styleUrls: ['./elements.scss']
})
export class BurgerComponent implements AfterViewInit {
  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('checkbox') checkbox!: ElementRef;

  ngAfterViewInit(): void {
    this.checkbox.nativeElement.addEventListener('change', () => {
      this.checkedChange.emit(this.checked);
    });
  }
}
