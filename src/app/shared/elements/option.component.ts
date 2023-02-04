import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cOption',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./elements.scss']
})
export class OptionComponent implements AfterViewInit {
  @Input('value') value: any = undefined;
  @Input('selected') selected: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();

  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    if(this.element.nativeElement.childNodes.length < 1) {
      throw new Error('Option content cannot be void');
    } else if(this.element.nativeElement.childNodes.length > 1 || this.element.nativeElement.childNodes[0].nodeName !== '#text') {
      throw new Error('Option content must be text only');
    } else {
      let optionElement: HTMLOptionElement = new Option(this.element.nativeElement.childNodes[0].wholeText, undefined, this.selected, this.selected);
      optionElement.addEventListener('click', () => {
        this.selectionChange.emit(this.value);
      });
      this.element.nativeElement.parentElement.append(optionElement);
    }
  }
}
