import { AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, Output, QueryList, ViewChild } from '@angular/core';
import { OptionComponent } from './option.component';

@Component({
  selector: 'cSelect',
  template: `
    <div class="custom-select">
      <select #select>
        <ng-content></ng-content>
      </select>
    </div>
  `,
  styleUrls: ['./elements.scss']
})
export class SelectComponent implements AfterViewInit {
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('select') select!: ElementRef;

  @ContentChildren(OptionComponent) optionComponents!: QueryList<OptionComponent>;

  ngAfterViewInit(): void {
    this.optionComponents?.toArray().forEach((optionComponent) => {
      optionComponent.selectionChange.subscribe({
        next: (value: any) => {
          this.selectionChange.emit(value);
        }
      });
    })
  }
}
