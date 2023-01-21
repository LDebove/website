import { Component, Input } from '@angular/core';

@Component({
  selector: 'cLoader',
  template: `
    <div class="custom-loader" [ngStyle]="{'display': loading ? 'block' : 'none'}"></div>
  `,
  styleUrls: ['./elements.scss'],
})
export class LoaderComponent {
  @Input('loading') loading: boolean = true;
}
