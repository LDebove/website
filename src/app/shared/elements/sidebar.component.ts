import { AfterContentChecked, AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'cSidebar',
  template: `
    <button *ngIf="!shown" class="show-button" (click)="showSidebar()">></button>
    <div class="custom-sidebar" #sidebar>
      <div class="top-content">
        <span class="title">{{ title }}</span>
        <button class="hide-button" (click)="hideSidebar()"><</button>
      </div>
      <div class="content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .custom-sidebar {
      display: flex;
      position: absolute;
      flex-direction: column;
      height: calc(100vh - 140px);
      max-width: 100vw;
      top: 70px;
      right: 100%;
      border-radius: 0 5px 5px 0;
      border: 1px solid var(--highlight-color-1);
      background-color: var(--color-5);
      color: #FFFFFF;
      box-sizing: border-box;
      transition: transform 0.5s;
      gap: 5px;
      z-index: 10;

      .top-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-weight: bold;
          text-decoration: underline;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .hide-button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 30px;
          background-color: transparent;
          color: #FFFFFF;
          border: 0;
          border-radius: 5px;
          box-sizing: border-box;
          font-weight: bold;
          font-size: larger;
          cursor: pointer;
          align-self: flex-end;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        overflow: hidden auto;
      }
    }

    .show-button {
      display: flex;
      position: absolute;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      top: 70px;
      left: 0;
      background-color: var(--color-5);
      color: #FFFFFF;
      border: 0;
      border-radius: 0 5px 5px 0;
      box-sizing: border-box;
      font-weight: bold;
      font-size: larger;
      cursor: pointer;
      z-index: 10;
    }
  `]
})
export class SidebarComponent implements AfterViewInit, AfterContentChecked {
  @Input('shown') shown: boolean = false;
  @Input('title') title: string = '';

  @ViewChild('sidebar') sidebar?: ElementRef;

  viewInit: boolean = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.viewInit = true;
  }

  ngAfterContentChecked(): void {
    if(this.viewInit) {
      this.displaySidebar();
    }
  }

  hideSidebar(): void {
    this.shown = false;
    this.displaySidebar();
  }

  showSidebar(): void {
    this.shown = true;
    this.displaySidebar();

  }

  displaySidebar(): void {
    let sidebarElement = <HTMLDivElement>this.sidebar?.nativeElement;
    let sidebarRect = sidebarElement.getBoundingClientRect();
    if(this.shown) {
      sidebarElement.style.transform = `translateX(${sidebarRect.width}px)`;
    } else {
      sidebarElement.style.removeProperty('transform');
    }
  }
}
