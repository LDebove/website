import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';



@NgModule({
  declarations: [
    SafeHtmlPipe,
    SafeUrlPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    TranslateModule
  ]
})
export class SharedModule { }
