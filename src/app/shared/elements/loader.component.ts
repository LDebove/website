import { Component } from '@angular/core';

@Component({
  selector: 'cLoader',
  template: `
    <div class="custom-loader"></div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-loader {
      border: 3px solid var(--color-5);
      border-left-color: transparent;
      border-radius: 50%;
      width: 100%;
      aspect-ratio: 1 / 1;
      animation: spin 1s linear infinite;
      box-sizing: border-box;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
}
