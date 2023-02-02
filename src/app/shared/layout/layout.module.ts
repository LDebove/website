import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared.module';
import { ScrollIndicatorDirective } from './header/scroll-indicator.directive';
import { LicenseComponent } from './license/license.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    ScrollIndicatorDirective,
    LicenseComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ]
})
export class LayoutModule { }
