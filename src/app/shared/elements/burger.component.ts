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
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-burger {
      --size-multiplier: 0.66;

      display: flex;
      position: relative;
      width: calc(var(--size-multiplier) * 40px);
      height: calc(var(--size-multiplier) * 30px);
      background: transparent;
      cursor: pointer;

      input {
        display: none;

        &:checked ~ span:nth-of-type(1) {
          transform: rotate(45deg);
          top: 0;
          left: calc(var(--size-multiplier) * 5px);
        }

        &:checked ~ span:nth-of-type(2) {
          width: 0;
          opacity: 0;
        }

        &:checked ~ span:nth-of-type(3) {
          transform: rotate(-45deg);
          top: calc(var(--size-multiplier) * 28px);
          left: calc(var(--size-multiplier) * 5px);
        }
      }

      span {
        display: block;
        position: absolute;
        height: calc(var(--size-multiplier) * 3px);
        width: 100%;
        background: var(--font-color);
        border-radius: 9px;
        opacity: 1;
        left: 0;
        transform: rotate(0deg);
        transition: .25s ease-in-out;

        &:nth-of-type(1) {
          top: 0;
          transform-origin: left center;
        }

        &:nth-of-type(2) {
          top: 50%;
          transform: translateY(-50%);
          transform-origin: left center;
        }

        &:nth-of-type(3) {
          top: 100%;
          transform-origin: left center;
          transform: translateY(-100%);
        }
      }
    }
  `]
})
export class BurgerComponent implements AfterViewInit {
  @Input() checked: boolean = false;
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('checkbox') checkbox?: ElementRef;

  ngAfterViewInit(): void {
    this.checkbox?.nativeElement.addEventListener('change', () => {
      this.checkedChange.emit(this.checked);
    });
  }
}
