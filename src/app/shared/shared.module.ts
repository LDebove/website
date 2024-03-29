import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { HorizontalScrollingDirective } from './directives/horizontal-scrolling.directive';
import { ToggleComponent } from './elements/toggle.component';
import { ThemeToggleComponent } from './elements/theme-toggle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './elements/select.component';
import { OptionComponent } from './elements/option.component';
import { BurgerComponent } from './elements/burger.component';
import { InputComponent } from './elements/input.component';
import { CheckboxComponent } from './elements/checkbox.component';
import { ButtonComponent } from './elements/button.component';
import { LoaderComponent } from './elements/loader.component';
import { HintComponent } from './elements/hint.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { FeedbackActionDirective } from './directives/feedback-action.directive';
import { SidebarComponent } from './elements/sidebar.component';



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
    ButtonComponent,
    LoaderComponent,
    HintComponent,
    TooltipDirective,
    FeedbackActionDirective,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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
    ButtonComponent,
    LoaderComponent,
    HintComponent,
    TooltipDirective,
    FeedbackActionDirective,
    FormsModule,
    ReactiveFormsModule,
    SidebarComponent
  ]
})
export class SharedModule { }
