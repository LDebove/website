import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { HorizontalScrollingDirective } from './directives/horizontal-scrolling.directive';
import { ToggleComponent } from './elements/toggle.component';
import { ThemeToggleComponent } from './elements/theme-toggle.component';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from './elements/select.component';
import { OptionComponent } from './elements/option.component';
import { BurgerComponent } from './elements/burger.component';
import { InputComponent } from './elements/input.component';
import { CheckboxComponent } from './elements/checkbox.component';
import { ButtonComponent } from './elements/button.component';



@NgModule({
  declarations: [
    SafeHtmlPipe,
    SafeUrlPipe,
    HorizontalScrollingDirective,
    ToggleComponent,
    ThemeToggleComponent,
    SelectComponent,
    OptionComponent,
    BurgerComponent,
    InputComponent,
    CheckboxComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    SafeHtmlPipe,
    SafeUrlPipe,
    HorizontalScrollingDirective,
    ToggleComponent,
    ThemeToggleComponent,
    SelectComponent,
    OptionComponent,
    BurgerComponent,
    InputComponent,
    CheckboxComponent,
    ButtonComponent
  ]
})
export class SharedModule { }
