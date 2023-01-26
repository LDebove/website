import { Component, Input } from '@angular/core';

@Component({
  selector: 'cHint',
  template: `
    <div class="custom-hint" cTooltip [tooltipText]="text">?<div>
  `,
  styleUrls: ['./elements.scss'],
})
export class HintComponent {
  @Input('text') text: string = '';
}
