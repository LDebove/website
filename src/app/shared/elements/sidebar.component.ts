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
  styleUrls: ['./elements.scss']
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
